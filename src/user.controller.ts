import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user-dto';
import { CreateUserDto } from './dto/create-user-dto';

@Controller('/user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('spotify/:spotifyId')
  async getuserBySpotifyId(
    @Param('spotifyId') spotifyId: string,
  ): Promise<UserDto> {
    return await this.appService.getuserBySpotifyId(spotifyId);
  }

  @Post('')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.appService.createUser(
      createUserDto.spotifyId,
      createUserDto.email,
    );
  }
}
