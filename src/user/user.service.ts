import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from '../dto/user-dto';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserBySpotifyId(spotifyId): Promise<UserDto> {
    const user = await this.userModel.findOne({ spotifyId }).exec();
    if (!user) {
      throw new NotFoundException(
        `User with spotifyId: ${spotifyId} was not found`,
      );
    }
    return {
      email: user.email,
      spotifyId: user.spotifyId,
      userId: user.id,
    };
  }

  async createUser(spotifyId: string, email: string): Promise<UserDto> {
    const user = await this.userModel.create({ spotifyId, email });
    return {
      email: user.email,
      spotifyId: user.spotifyId,
      userId: user.id,
    };
  }

  async getUserEmailMap(userIds: string[]) {
    const users = await this.userModel.find({ _id: { $in: userIds } });
    const emailMap = new Map<string, string>();

    users.forEach((user) => {
      emailMap.set(user._id.toString(), user.email); 
    });

    return emailMap;
  }
}
