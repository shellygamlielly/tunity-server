import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Song } from '../schemas/song.schema';
import { SongDto } from 'src/dto/song-dto';

@Injectable()
export class SongService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async getSongsCountForPlaylists(
    playlistIds: Array<ObjectId>,
  ): Promise<Record<string, number>> {
    const result = await this.songModel.aggregate([
      {
        $match: {
          playlistId: { $in: playlistIds },
        },
      },
      {
        $group: {
          _id: '$playlistId',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          playlistId: '$_id',
          count: 1,
        },
      },
    ]);
    const playlistCounts: Record<string, number> = {};
    result.forEach((item) => {
      playlistCounts[item.playlistId.toString()] = item.count;
    });

    return playlistCounts;
  }

  async getSongs(playlistId: string): Promise<SongDto[]> {
    const songs = await this.songModel
      .find({ playlistId })
      .sort({ createdAt: -1 })
      .exec();
    return songs.map((song) => ({
      spotifySongId: song.spotifySongId,
      name: song.name,
      playlistId: song.id,
      albumCoverUrl: song.albumCoverUrl,
      voters: song.voters,
    }));
  }

  async addSongToPlaylist(
    playlistId: string,
    spotifySongId: string,
    name: string,
    albumCoverUrl: string,
  ): Promise<ObjectId> {
    const song = await this.songModel.create({
      playlistId,
      spotifySongId,
      name,
      albumCoverUrl,
    });
    return song.id;
  }

  async removeSongFromPlaylist(playlistId: string, spotifySongId: string) {
    const result = await this.songModel.deleteOne({
      playlistId,
      spotifySongId,
    });
    if (!result.acknowledged) {
      console.error(
        `deleteOne of playlistId = ${playlistId}, spotifySongId = ${spotifySongId} not acknowledged.`,
      );
    }
  }

  async removeSongsFromPlaylist(playlistId: string) {
    const result = await this.songModel.deleteMany({
      playlistId,
    });
    if (!result.acknowledged) {
      console.error(
        `delete all songs of playlist with id = ${playlistId} not acknowledged.`,
      );
    }
  }

  async addVoteToSong(
    playlistId: string,
    spotifySongId: string,
    userId: string,
  ): Promise<number> {
    const updatedSong = await this.songModel
      .findOneAndUpdate(
        { playlistId, spotifySongId },
        {
          $addToSet: { voters: userId },
        },
        { new: true },
      )
      .exec();

    if (!updatedSong) {
      throw new NotFoundException('Song not found.');
    }

    return updatedSong.voters.length;
  }

  async removeVoteToSong(
    playlistId: string,
    spotifySongId: string,
    userId: string,
  ) {
    const updatedSong = await this.songModel
      .findOneAndUpdate(
        { playlistId, spotifySongId },
        { $pull: { voters: userId } },
        { new: true },
      )
      .exec();
    if (!updatedSong) {
      throw new NotFoundException('Song not found.');
    }
    return updatedSong.voters.length;
  }

  async getVoteCountForSong(
    playlistId: string,
    spotifySongId: string,
  ): Promise<number> {
    const song = await this.songModel
      .findOne({ playlistId, spotifySongId })
      .exec();
    if (!song) {
      throw new NotFoundException(
        `Song with spotifySongId: ${spotifySongId} was not found in playlist with playlistId ${playlistId}`,
      );
    }
    return song.voters.length;
  }
}
