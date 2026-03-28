import { Controller, Get, Patch, Delete, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getAll(@Query('familyId') familyId: string, @Req() req: any) {
    return this.notificationsService.getAll(familyId, req.user.userId);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }

  @Patch('read-all')
  markAllRead(@Query('familyId') familyId: string, @Req() req: any) {
    return this.notificationsService.markAllRead(familyId, req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }
}
