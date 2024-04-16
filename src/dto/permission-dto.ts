import { PermissionEnum } from 'src/schemas/permission.schema';

export class PermissionDto {
  permission: PermissionEnum;
  playlistId: string;
  userId: string;
}
