import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { SongService } from './song.service';
import { SongDto } from 'src/dto/song-dto';
import { ObjectId } from 'mongoose';
import { AuthInterceptor } from 'src/interceptors/auth.interceptors';

@Controller('/song')
@UseInterceptors(AuthInterceptor)
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post('')
  async addSongToPlaylist(@Body() songDto: SongDto): Promise<ObjectId> {
    const songId = await this.songService.addSongToPlaylist(
      songDto.playlistId,
      songDto.spotifySongId,
      songDto.name,
      songDto.albumCoverUrl,
    );
    return songId;
  }

  @Put('/vote/:userId')
  async addVoteToSong(
    @Body() songDto: SongDto,
    @Param('userId') userId: string,
  ): Promise<Array<string>> {
    return await this.songService.addVoteToSong(
      songDto.playlistId,
      songDto.spotifySongId,
      userId,
    );
  }

  @Delete('/unvote/:userId')
  async removeVoteToSong(
    @Body() songDto: SongDto,
    @Param('userId') userId: string,
  ): Promise<Array<string>> {
    return await this.songService.removeVoteToSong(
      songDto.playlistId,
      songDto.spotifySongId,
      userId,
    );
  }

  @Delete('/:playlistId/:spotifySongId')
  async removeSongFromPlaylist(
    @Param('playlistId') playlistId: string,
    @Param('spotifySongId') spotifySongId: string,
  ): Promise<void> {
    await this.songService.removeSongFromPlaylist(playlistId, spotifySongId);
  }
}
