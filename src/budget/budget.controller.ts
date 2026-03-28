import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BudgetService } from './budget.service';

@Controller('budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Get('income-sources')
  getIncomeSources(@Query('familyId') familyId: string) {
    return this.budgetService.getIncomeSources(familyId);
  }

  @Post('income-sources')
  createIncomeSource(@Body() body: any, @Req() req: any) {
    return this.budgetService.createIncomeSource(body, req.user.userId);
  }

  @Patch('income-sources/:id')
  updateIncomeSource(@Param('id') id: string, @Body() body: any) {
    return this.budgetService.updateIncomeSource(id, body);
  }

  @Delete('income-sources/:id')
  deleteIncomeSource(@Param('id') id: string) {
    return this.budgetService.deleteIncomeSource(id);
  }

  @Get('expense-categories')
  getExpenseCategories(@Query('familyId') familyId: string) {
    return this.budgetService.getExpenseCategories(familyId);
  }

  @Post('expense-categories')
  createExpenseCategory(@Body() body: any, @Req() req: any) {
    return this.budgetService.createExpenseCategory(body, req.user.userId);
  }

  @Patch('expense-categories/:id')
  updateExpenseCategory(@Param('id') id: string, @Body() body: any) {
    return this.budgetService.updateExpenseCategory(id, body);
  }

  @Delete('expense-categories/:id')
  deleteExpenseCategory(@Param('id') id: string) {
    return this.budgetService.deleteExpenseCategory(id);
  }
}
