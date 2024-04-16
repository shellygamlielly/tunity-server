import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { PermissionDto } from 'src/dto/permission-dto';
import { Permission, PermissionEnum } from 'src/schemas/permission.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
  ) {}

  async updatePermission(
    userId: string,
    playlistId: string,
    newPermission: PermissionEnum,
  ): Promise<void> {
    const filter = { userId, playlistId };
    const update = { permission: newPermission };

    const updatedPermission = await this.permissionModel.findOneAndUpdate(
      filter,
      update,
      { new: true }, // Return the updated document
    );

    if (!updatedPermission) {
      throw new Error('Permission not found');
    }
  }

  async getSharedPlaylists(userId: string): Promise<Array<PermissionDto>> {
    return await this.permissionModel.find({ userId });
  }

  async getPlaylistCollaborators(
    playlistId: string,
  ): Promise<Array<PermissionDto>> {
    return await this.permissionModel.find({ playlistId });
  }
}
