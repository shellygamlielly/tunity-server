import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistDto } from '../dto/playlist-dto';

@Controller('/playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get('/:ownerId')
  async getPlaylistsByOwnerId(
    @Param('ownerId') ownerId: string,
  ): Promise<PlaylistDto[]> {
    return await this.playlistService.getPlaylistsByOwnerId(ownerId);
  }

  @Post('')
  async createPlaylist(@Body() createPlaylistDto: PlaylistDto) {
    return await this.playlistService.createPlaylist(
      createPlaylistDto.ownerId,
      createPlaylistDto.name,
    );
  }
}
