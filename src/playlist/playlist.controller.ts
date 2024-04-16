import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from '../dto/create-playlist-dto';
import { PlaylistDto } from 'src/dto/playlist-dto';
import { AuthInterceptor } from 'src/interceptors/auth.interceptors';
import { CollaboratorsDto } from 'src/dto/collaborators-dto';

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
  @Get('/collaborators/:playlistId')
  async getPlaylistCollaborators(
    @Param('playlistId') playlistId: string,
  ): Promise<CollaboratorsDto[]> {
    return await this.playlistService.getPlaylistCollaborators(playlistId);
  }

  @Get('/shared')
  async getPlaylistSharedWithUser(
    @Req() req: any,
  ): Promise<CreatePlaylistDto[]> {
    return await this.playlistService.getPlaylistsSharedWithUser(req.userId);
  }

  @Post('')
  async createPlaylist(
    @Body() { name, imageUrl }: { name: string; imageUrl: string },
    @Req() req: any,
  ) {
    return await this.playlistService.createPlaylist(
      req.userId,
      name,
      imageUrl,
    );
  }

  @Delete('/:playlistId')
  async removePlaylist(
    @Req() req: any,
    @Param('playlistId') playlistId: string,
  ): Promise<void> {
    await this.playlistService.removePlaylist(req.userId, playlistId);
  }
}
