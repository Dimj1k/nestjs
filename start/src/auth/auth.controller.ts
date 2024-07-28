import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { USER_IS_ALREADY } from './auth.constants';
import { mongo } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.userService.findUser(dto.email);
    if (oldUser) throw new BadRequestException(USER_IS_ALREADY);
    let newUser = await this.userService.createUser(dto);
    return newUser;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const user = await this.userService.validateUser(dto);
    return this.userService.login(user.email);
  }
}
