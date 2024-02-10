import { Song } from 'src/schemas/song.schema';

export class PlaylistDto {
  name: string;
  playlistId: string;
  maxTime: number;
  songs: Song[];
}
