import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Playlist } from './playlist.schema';

export type SongDocument = HydratedDocument<Song>;

@Schema({ timestamps: true })
export class Song {
  @Prop({ type: Types.ObjectId, required: true, ref: Playlist.name })
  playlistId: string;

  @Prop({ type: String, required: true })
  spotifySongId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  albumCoverUrl: string;

  @Prop({ type: [String], default: [] })
  voters: string[];
}

export const SongSchema = SchemaFactory.createForClass(Song);
SongSchema.index({ playlistId: 1, spotifySongId: 1 }, { unique: true });
