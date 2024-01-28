import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getuserBySpotifyId(spotifyId): Promise<UserDto> {
    const user = await this.userModel.findOne({ spotifyId }).exec();
    if (!user) {
      throw new NotFoundException(`Resource with ID ${spotifyId} not found`);
    }
    return user;
  }

  async createUser(spotifyId: string, email: string): Promise<string> {
    const user = await this.userModel.create({ spotifyId, email });
    return user.id;
  }
}
