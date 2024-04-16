import { Song } from 'src/schemas/song.schema';

export class PlaylistDto {
  ownerId: string;
  name: string;
  playlistId: string;
  imageUrl: string;
  maxTime: number;
  songs: Song[];
}
