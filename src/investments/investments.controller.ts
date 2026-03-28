import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InvestmentsService } from './investments.service';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private investmentsService: InvestmentsService) {}

  @Get()
  getAll(@Query('familyId') familyId: string) {
    return this.investmentsService.getAll(familyId);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.investmentsService.create(body, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.investmentsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.investmentsService.delete(id);
  }
}
