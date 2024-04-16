import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema({ timestamps: true })
export class Playlist {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  ownerId: string;

  @Prop({ type: String, required: true })
  imageUrl: string;

  @Prop({ type: Boolean })
  readOnlyPublic: boolean;

  @Prop({ type: Number })
  maxTimeSeconds: number;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

PlaylistSchema.index({ ownerId: 1, name: 1 }, { unique: true });
