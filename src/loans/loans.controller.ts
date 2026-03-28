import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoansService } from './loans.service';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Get()
  getLoans(@Query('familyId') familyId: string) {
    return this.loansService.getLoans(familyId);
  }

  @Post()
  createLoan(@Body() body: any, @Req() req: any) {
    return this.loansService.createLoan(body, req.user.userId);
  }

  @Patch(':id')
  updateLoan(@Param('id') id: string, @Body() body: any) {
    return this.loansService.updateLoan(id, body);
  }

  @Delete(':id')
  deleteLoan(@Param('id') id: string) {
    return this.loansService.deleteLoan(id);
  }

  @Get(':id/payments')
  getPayments(@Param('id') id: string) {
    return this.loansService.getPayments(id);
  }

  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.loansService.addPayment(id, body, req.user.userId);
  }
}
