import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonthlyController } from './monthly.controller';
import { MonthlyService } from './monthly.service';
import { IncomeRecord, IncomeRecordSchema } from '../schemas/income-record.schema';
import { ExpenseRecord, ExpenseRecordSchema } from '../schemas/expense-record.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncomeRecord.name, schema: IncomeRecordSchema },
      { name: ExpenseRecord.name, schema: ExpenseRecordSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [MonthlyController],
  providers: [MonthlyService],
})
export class MonthlyModule {}
