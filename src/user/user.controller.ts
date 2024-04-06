import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '../dto/user-dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('spotify/:spotifyId')
  async getuserBySpotifyId(
    @Param('spotifyId') spotifyId: string,
  ): Promise<UserDto> {
    return await this.userService.getUserBySpotifyId(spotifyId);
  }

  @Post('')
  async createUser(@Body() createUserDto: any) {
    return await this.userService.createUser(
      createUserDto.spotifyId,
      createUserDto.email,
    );
  }
}
