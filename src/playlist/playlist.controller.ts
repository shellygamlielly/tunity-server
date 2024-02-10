import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from '../dto/create-playlist-dto';
import { PlaylistDto } from 'src/dto/playlist-dto';

@Controller('/playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get('/:ownerId')
  async getPlaylistsByOwnerId(
    @Param('ownerId') ownerId: string,
  ): Promise<CreatePlaylistDto[]> {
    return await this.playlistService.getPlaylistsByOwnerId(ownerId);
  }

  @Get('/playlistId/:playlistId')
  async getPlaylistById(
    @Param('playlistId') playlistId: string,
  ): Promise<PlaylistDto> {
    return await this.playlistService.getPlaylistById(playlistId);
  }

  @Post('')
  async createPlaylist(@Body() createPlaylistDto: CreatePlaylistDto) {
    return await this.playlistService.createPlaylist(
      createPlaylistDto.ownerId,
      createPlaylistDto.name,
    );
  }

  @Delete('/playlistId/:playlistId')
  async removePlaylist(@Param('playlistId') playlistId: string): Promise<void> {
    await this.playlistService.removePlaylist(playlistId);
  }
}
