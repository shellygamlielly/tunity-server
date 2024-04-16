import { PermissionEnum } from 'src/schemas/permission.schema';

export class CollaboratorsDto {
  permission: PermissionEnum;
  playlistId: string;
  userId: string;
  userEmail: string;
}
