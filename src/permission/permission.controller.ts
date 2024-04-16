import { Body, Controller, Put, Req, UseInterceptors } from '@nestjs/common';

import { AuthInterceptor } from 'src/interceptors/auth.interceptors';
import { PermissionService } from './permission.service';
import { PermissionEnum } from 'src/schemas/permission.schema';

@Controller('/permission')
@UseInterceptors(AuthInterceptor)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Put(':playlistId/:voter')
  async upgradePermissionToVoter(
    @Body() { playlistId }: { playlistId: string },
    @Req() req: any,
  ) {
    return await this.permissionService.updatePermission(
      req.userId,
      playlistId,
      PermissionEnum.VIEWER,
    );
  }

  @Put(':playlistId/:editor')
  async upgradePermissionToEditor(
    @Body() { playlistId }: { playlistId: string },
    @Req() req: any,
  ) {
    return await this.permissionService.updatePermission(
      req.userId,
      playlistId,
      PermissionEnum.EDITOR,
    );
  }
}
