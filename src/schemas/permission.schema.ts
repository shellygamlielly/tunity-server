import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { User, UserSchema } from './user.schema';
import { Playlist } from './playlist.schema';

export enum PermissionEnum {
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export type PermissionDocument = HydratedDocument<Permission>;

@Schema()
export class Permission {
  @Prop({ type: Types.ObjectId, required: true, ref: Playlist.name })
  playlistId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: string;

  @Prop({ type: String, enum: Object.values(PermissionEnum), required: true })
  permission: PermissionEnum;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
PermissionSchema.index({ playlistId: 1, userId: 1 }, { unique: true });
