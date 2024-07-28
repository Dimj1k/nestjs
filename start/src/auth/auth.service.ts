import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './auth.model';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import { INCORRECT_PASSWORD, USER_IS_NOT_FOUND } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { addMinutes, subMinutes } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto): Promise<UserDocument> {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: dto.email,
      passwordHash: await hash(dto.password, salt),
    });
    return newUser.save();
  }

  async findUser(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser({
    email,
    password,
  }: AuthDto): Promise<Pick<AuthDto, 'email'>> {
    const user = await this.findUser(email);
    if (!user) throw new UnauthorizedException(USER_IS_NOT_FOUND);
    const isCorrectedPassword = await compare(password, user.passwordHash);
    if (!isCorrectedPassword)
      throw new UnauthorizedException(INCORRECT_PASSWORD);
    return { email };
  }

  async login(email: string) {
    const payload = { email, expired: addMinutes(new Date(), 5) };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
