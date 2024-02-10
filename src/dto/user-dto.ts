import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  spotifyId: string;
  @IsNotEmpty()
  userId: string;
}
