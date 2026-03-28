import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { BankAccount, BankAccountSchema } from '../schemas/bank-account.schema';
import { CreditCard, CreditCardSchema } from '../schemas/credit-card.schema';
import { CreditCardBill, CreditCardBillSchema } from '../schemas/credit-card-bill.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BankAccount.name, schema: BankAccountSchema },
      { name: CreditCard.name, schema: CreditCardSchema },
      { name: CreditCardBill.name, schema: CreditCardBillSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
