import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InsuranceService } from './insurance.service';

@Controller('insurance')
@UseGuards(JwtAuthGuard)
export class InsuranceController {
  constructor(private insuranceService: InsuranceService) {}

  @Get()
  getAll(@Query('familyId') familyId: string) {
    return this.insuranceService.getAll(familyId);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.insuranceService.create(body, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.insuranceService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.insuranceService.delete(id);
  }
}
