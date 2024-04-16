import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from '../dto/create-playlist-dto';
import { PlaylistDto } from 'src/dto/playlist-dto';
import { AuthInterceptor } from 'src/interceptors/auth.interceptors';
import { CollaboratorsDto } from 'src/dto/collaborators-dto';

@Controller('/playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseInterceptors(AuthInterceptor)
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

  @UseInterceptors(AuthInterceptor)
  @Get('/collaborators/:playlistId')
  async getPlaylistCollaborators(
    @Param('playlistId') playlistId: string,
  ): Promise<CollaboratorsDto[]> {
    return await this.playlistService.getPlaylistCollaborators(playlistId);
  }

  @UseInterceptors(AuthInterceptor)
  @Get('/shared')
  async getPlaylistSharedWithUser(
    @Req() req: any,
  ): Promise<CreatePlaylistDto[]> {
    return await this.playlistService.getPlaylistsSharedWithUser(req.userId);
  }

  @UseInterceptors(AuthInterceptor)
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

  @UseInterceptors(AuthInterceptor)
  @Put('/public')
  async setPlaylistAsPublic(
    @Body() { playlistId }: { playlistId: string },
    @Req() req: any,
  ) {
    const ownerId = (await this.playlistService.getPlaylistById(playlistId))
      .ownerId;
    if (req.userId == ownerId) {
      return await this.playlistService.setPlaylistAsPublicReadOnly(playlistId);
    } else {
      throw new UnauthorizedException(
        'only owner can change playlist permissions.',
      );
    }
  }

  @UseInterceptors(AuthInterceptor)
  @Put('/private')
  async setPlaylistAsPrivate(
    @Body() { playlistId }: { playlistId: string },
    @Req() req: any,
  ) {
    const ownerId = (await this.playlistService.getPlaylistById(playlistId))
      .ownerId;
    if (req.userId == ownerId) {
      return await this.playlistService.setPlaylistAsPrivate(playlistId);
    } else {
      throw new UnauthorizedException(
        'only owner can chnage playlist permissions.',
      );
    }
  }

  @Get('/shared/:playlistId')
  async isPlaylistPublicReadOnly(
    @Param('playlistId') playlistId: string,
  ): Promise<boolean> {
    return await this.playlistService.isPlaylistPublicReadOnly(playlistId);
  }

  @UseInterceptors(AuthInterceptor)
  @Delete('/:playlistId')
  async removePlaylist(@Param('playlistId') playlistId: string): Promise<void> {
    await this.playlistService.removePlaylist(playlistId);
  }
}
