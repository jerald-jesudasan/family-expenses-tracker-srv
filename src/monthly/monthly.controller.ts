import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MonthlyService } from './monthly.service';

@Controller('monthly')
@UseGuards(JwtAuthGuard)
export class MonthlyController {
  constructor(private monthlyService: MonthlyService) {}

  @Get('summary')
  getSummary(@Query('familyId') familyId: string, @Query('year') year: string, @Query('month') month: string) {
    return this.monthlyService.getMonthlySummary(familyId, +year, +month);
  }

  @Get('income-records')
  getIncomeRecords(@Query('familyId') familyId: string, @Query('year') year: string, @Query('month') month: string) {
    return this.monthlyService.getIncomeRecords(familyId, +year, +month);
  }

  @Post('income-records')
  createIncomeRecord(@Body() body: any, @Req() req: any) {
    return this.monthlyService.createIncomeRecord(body, req.user.userId);
  }

  @Patch('income-records/:id')
  updateIncomeRecord(@Param('id') id: string, @Body() body: any) {
    return this.monthlyService.updateIncomeRecord(id, body);
  }

  @Get('expense-records')
  getExpenseRecords(@Query('familyId') familyId: string, @Query('year') year: string, @Query('month') month: string) {
    return this.monthlyService.getExpenseRecords(familyId, +year, +month);
  }

  @Post('expense-records')
  createExpenseRecord(@Body() body: any, @Req() req: any) {
    return this.monthlyService.createExpenseRecord(body, req.user.userId);
  }

  @Patch('expense-records/:id')
  updateExpenseRecord(@Param('id') id: string, @Body() body: any) {
    return this.monthlyService.updateExpenseRecord(id, body);
  }

  @Get('transactions')
  getTransactions(@Query('familyId') familyId: string, @Query('year') year: string, @Query('month') month: string) {
    return this.monthlyService.getTransactions(familyId, +year, +month);
  }

  @Post('transactions')
  createTransaction(@Body() body: any, @Req() req: any) {
    return this.monthlyService.createTransaction(body, req.user.userId);
  }

  @Delete('transactions/:id')
  deleteTransaction(@Param('id') id: string) {
    return this.monthlyService.deleteTransaction(id);
  }
}
