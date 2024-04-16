import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { Playlist, PlaylistSchema } from './schemas/playlist.schema';
import { Song, SongSchema } from './schemas/song.schema';
import { PlaylistController } from './playlist/playlist.controller';
import { SongController } from './song/song.controller';
import { PlaylistService } from './playlist/playlist.service';
import { SongService } from './song/song.service';
import { MongoDBService } from './mongodb.service';
import { AuthInterceptor } from './interceptors/auth.interceptors';
import { PermissionController } from './permission/permission.controller';
import { PermissionService } from './permission/permission.service';
import { Permission, PermissionSchema } from './schemas/permission.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: MongoDBService,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [
    UserController,
    PlaylistController,
    SongController,
    PermissionController,
  ],
  providers: [
    AuthInterceptor,
    UserService,
    PlaylistService,
    SongService,
    PermissionService,
  ],
})
export class AppModule {}
