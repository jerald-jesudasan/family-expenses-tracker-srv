import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('bank')
  getBankAccounts(@Query('familyId') familyId: string) {
    return this.accountsService.getBankAccounts(familyId);
  }

  @Get('bank/:id')
  getBankAccount(@Param('id') id: string) {
    return this.accountsService.getBankAccount(id);
  }

  @Post('bank')
  createBankAccount(@Body() body: any, @Req() req: any) {
    return this.accountsService.createBankAccount(body, req.user.userId);
  }

  @Patch('bank/:id')
  updateBankAccount(@Param('id') id: string, @Body() body: any) {
    return this.accountsService.updateBankAccount(id, body);
  }

  @Delete('bank/:id')
  deleteBankAccount(@Param('id') id: string) {
    return this.accountsService.deleteBankAccount(id);
  }

  @Patch('bank/:id/set-primary')
  setPrimary(@Param('id') id: string, @Body('familyId') familyId: string) {
    return this.accountsService.setPrimaryAccount(id, familyId);
  }

  @Get('summary')
  getSummary(@Query('familyId') familyId: string) {
    return this.accountsService.getAccountsSummary(familyId);
  }

  @Get('credit-cards')
  getCreditCards(@Query('familyId') familyId: string) {
    return this.accountsService.getCreditCards(familyId);
  }

  @Get('credit-cards/:id')
  getCreditCard(@Param('id') id: string) {
    return this.accountsService.getCreditCard(id);
  }

  @Post('credit-cards')
  createCreditCard(@Body() body: any, @Req() req: any) {
    return this.accountsService.createCreditCard(body, req.user.userId);
  }

  @Patch('credit-cards/:id')
  updateCreditCard(@Param('id') id: string, @Body() body: any) {
    return this.accountsService.updateCreditCard(id, body);
  }

  @Delete('credit-cards/:id')
  deleteCreditCard(@Param('id') id: string) {
    return this.accountsService.deleteCreditCard(id);
  }

  @Get('credit-card-bills')
  getBills(
    @Query('creditCardId') creditCardId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.accountsService.getCreditCardBills(creditCardId, year ? +year : undefined, month ? +month : undefined);
  }

  @Post('credit-card-bills')
  createBill(@Body() body: any, @Req() req: any) {
    return this.accountsService.createCreditCardBill(body, req.user.userId, body.family_id);
  }

  @Patch('credit-card-bills/:id')
  updateBill(@Param('id') id: string, @Body() body: any) {
    return this.accountsService.updateCreditCardBill(id, body);
  }

  @Post('credit-card-bills/:id/pay')
  payBill(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.accountsService.payCreditCardBill(id, body.amount, body.fromAccountId, req.user.userId, body.familyId, body.notes);
  }

  @Delete('credit-card-bills/:id')
  deleteBill(@Param('id') id: string) {
    return this.accountsService.deleteCreditCardBill(id);
  }
}
