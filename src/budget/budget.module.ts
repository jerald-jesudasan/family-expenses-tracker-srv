import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { IncomeSource, IncomeSourceSchema } from '../schemas/income-source.schema';
import { ExpenseCategory, ExpenseCategorySchema } from '../schemas/expense-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncomeSource.name, schema: IncomeSourceSchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
    ]),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
