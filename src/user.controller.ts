import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user-dto';

@Controller('/user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('spotify/:spotifyId')
  async getuserBySpotifyId(
    @Param('spotifyId') spotifyId: string,
  ): Promise<UserDto> {
    return await this.appService.getuserBySpotifyId(spotifyId);
  }
}
