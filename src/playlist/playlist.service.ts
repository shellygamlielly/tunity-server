import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreatePlaylistDto } from '../dto/create-playlist-dto';
import { Playlist } from 'src/schemas/playlist.schema';
import { SongService } from 'src/song/song.service';
import { PlaylistDto } from 'src/dto/playlist-dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    private readonly songService: SongService,
  ) {}

  async createPlaylist(
    userId: string,
    name: string,
    imageUrl: string,
  ): Promise<string> {
    const playlist = await this.playlistModel.create({
      name,
      ownerId: userId,
      imageUrl,
    });
    return playlist.id;
  }

  async removePlaylist(userId: string, playlistId: string) {
    //if userid has no such playlist permission do not remove
    await this.playlistModel.findByIdAndDelete(playlistId);
    this.songService.removeSongsFromPlaylist(playlistId);
  }

  async getPlaylistById(playlistId: string): Promise<PlaylistDto> {
    const playlist = await this.playlistModel.findById(playlistId);

    const songsInPlaylist = await this.songService.getSongs(playlistId);
    return {
      name: playlist.name,
      playlistId: playlist.id,
      imageUrl: playlist.imageUrl,
      maxTime: playlist.maxTimeSeconds,
      songs: songsInPlaylist,
    };
  }

  async getPlaylistsByOwnerId(ownerId: string): Promise<CreatePlaylistDto[]> {
    const playlists = await this.playlistModel
      .find({ ownerId })
      .sort({ createdAt: -1 })
      .exec();
    const playlistIds = playlists.map((playlist) => playlist.id);
    const songsCountMap =
      await this.songService.getSongsCountForPlaylists(playlistIds);

    return playlists.map((playlist) => ({
      ownerId: playlist.ownerId,
      imageUrl: playlist.imageUrl,
      playlistId: playlist.id,
      name: playlist.name,
      maxTime: playlist.maxTimeSeconds,
      songsCount: songsCountMap[playlist.id] || 0,
    }));
  }

  async getPlaylistsByUserId(userId: ObjectId) {
    //not just owner any permission
  }

  async getPlaylistCollaborators(playlistId: ObjectId) {
    //not just owner any permission
  }
}
