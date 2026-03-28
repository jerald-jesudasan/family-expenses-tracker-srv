import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get()
  getSchedules(@Query('familyId') familyId: string) {
    return this.schedulesService.getSchedules(familyId);
  }

  @Post()
  createSchedule(@Body() body: any, @Req() req: any) {
    return this.schedulesService.createSchedule(body, req.user.userId);
  }

  @Patch(':id')
  updateSchedule(@Param('id') id: string, @Body() body: any) {
    return this.schedulesService.updateSchedule(id, body);
  }

  @Delete(':id')
  deleteSchedule(@Param('id') id: string) {
    return this.schedulesService.deleteSchedule(id);
  }

  @Get('instances')
  getInstances(@Query('familyId') familyId: string, @Query('year') year: string, @Query('month') month: string) {
    return this.schedulesService.getInstances(familyId, +year, +month);
  }

  @Post('instances/:id/pay')
  payInstance(@Param('id') id: string, @Body() body: any) {
    return this.schedulesService.payInstance(id, body);
  }
}
