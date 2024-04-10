import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from '../dto/create-playlist-dto';
import { PlaylistDto } from 'src/dto/playlist-dto';
import { AuthInterceptor } from 'src/interceptors/auth.interceptors';

@Controller('/playlist')
@UseInterceptors(AuthInterceptor)
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get('')
  async getUserPlaylists(@Req() req: any): Promise<CreatePlaylistDto[]> {
    return await this.playlistService.getPlaylistsByOwnerId(req.userId);
  }

  @Get('/:playlistId')
  async getPlaylistById(
    @Param('playlistId') playlistId: string,
  ): Promise<PlaylistDto> {
    return await this.playlistService.getPlaylistById(playlistId);
  }

  @Post('')
  async createPlaylist(@Body() { name }: { name: string }, @Req() req: any) {
    return await this.playlistService.createPlaylist(req.userId, name);
  }

  @Delete('/:playlistId')
  async removePlaylist(
    @Req() req: any,
    @Param('playlistId') playlistId: string,
  ): Promise<void> {
    await this.playlistService.removePlaylist(req.userId, playlistId);
  }
}
