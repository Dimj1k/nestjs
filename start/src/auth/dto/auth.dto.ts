import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Поле e-mail должно содержать электронную почту' })
  email: string;
  @IsString()
  password: string;
}
