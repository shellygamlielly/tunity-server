import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { PlaylistDto } from '../dto/playlist-dto';
import { Playlist } from 'src/schemas/playlist.schema';
import { SongService } from 'src/song/song.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    private readonly songService: SongService,
  ) {}

  async createPlaylist(userId: string, name: string): Promise<string> {
    const playlist = await this.playlistModel.create({ name, ownerId: userId });
    return playlist.id;
  }

  async getPlaylistsByOwnerId(ownerId: string): Promise<PlaylistDto[]> {
    const playlists = await this.playlistModel.find({ ownerId }).exec();
    const playlistIds = playlists.map((playlist) => playlist.id);
    const songsCountMap =
      await this.songService.getSongsCountForPlaylists(playlistIds);

    return playlists.map((playlist) => ({
      ownerId: playlist.ownerId,
      playlistId: playlist.id,
      name: playlist.name,
      maxTime: playlist.maxTimeSeconds,
      songsCount: songsCountMap[playlist.id] || 0, // Default to 0 if not found
    }));
  }

  async getPlaylistsByUserId(userId: ObjectId) {
    //any permission
  }

  async findPlaylistIdByName(
    userId: string,
    playlistName: string,
  ): Promise<string> {
    const playlist = await this.playlistModel
      .findOne({ ownerId: userId, playlistName })
      .exec();
    if (!playlist) {
      throw new NotFoundException(
        `Playlist ${playlistName} of user : ${userId} was not found`,
      );
    }
    return playlist.id;
  }
}
