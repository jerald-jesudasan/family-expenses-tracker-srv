import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LendingService } from './lending.service';

@Controller('lending')
@UseGuards(JwtAuthGuard)
export class LendingController {
  constructor(private lendingService: LendingService) {}

  @Get()
  getAll(@Query('familyId') familyId: string) {
    return this.lendingService.getAll(familyId);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.lendingService.create(body, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.lendingService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.lendingService.delete(id);
  }

  @Get(':id/payments')
  getPayments(@Param('id') id: string) {
    return this.lendingService.getPayments(id);
  }

  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.lendingService.addPayment(id, body, req.user.userId);
  }
}
