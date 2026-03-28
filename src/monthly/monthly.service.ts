import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncomeRecord, IncomeRecordDocument } from '../schemas/income-record.schema';
import { ExpenseRecord, ExpenseRecordDocument } from '../schemas/expense-record.schema';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

@Injectable()
export class MonthlyService {
  constructor(
    @InjectModel(IncomeRecord.name) private incomeRecordModel: Model<IncomeRecordDocument>,
    @InjectModel(ExpenseRecord.name) private expenseRecordModel: Model<ExpenseRecordDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async getMonthlySummary(familyId: string, year: number, month: number) {
    const [incomeRecords, expenseRecords] = await Promise.all([
      this.incomeRecordModel.find({ family_id: familyId, year, month }).lean(),
      this.expenseRecordModel.find({ family_id: familyId, year, month }).lean(),
    ]);
    return {
      income_records: incomeRecords.map(toPlain),
      expense_records: expenseRecords.map(toPlain),
      totalIncomePlanned: incomeRecords.reduce((s, r) => s + r.planned_amount, 0),
      totalIncomeReceived: incomeRecords.reduce((s, r) => s + (r.received_amount || 0), 0),
      totalExpensePlanned: expenseRecords.reduce((s, r) => s + r.planned_amount, 0),
      totalExpenseSpent: expenseRecords.reduce((s, r) => s + (r.spent_amount || 0), 0),
    };
  }

  async getIncomeRecords(familyId: string, year: number, month: number) {
    return (await this.incomeRecordModel.find({ family_id: familyId, year, month }).lean()).map(toPlain);
  }

  async createIncomeRecord(data: any, userId: string) {
    return toPlain((await this.incomeRecordModel.create({ ...data, created_by: userId })).toObject());
  }

  async updateIncomeRecord(id: string, data: any) {
    return toPlain(await this.incomeRecordModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async getExpenseRecords(familyId: string, year: number, month: number) {
    return (await this.expenseRecordModel.find({ family_id: familyId, year, month }).lean()).map(toPlain);
  }

  async createExpenseRecord(data: any, userId: string) {
    return toPlain((await this.expenseRecordModel.create({ ...data, created_by: userId })).toObject());
  }

  async updateExpenseRecord(id: string, data: any) {
    return toPlain(await this.expenseRecordModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async getTransactions(familyId: string, year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    return (await this.transactionModel.find({ family_id: familyId, date: { $gte: startDate, $lte: endDate } }).lean()).map(toPlain);
  }

  async createTransaction(data: any, userId: string) {
    return toPlain((await this.transactionModel.create({ ...data, created_by: userId })).toObject());
  }

  async deleteTransaction(id: string) {
    await this.transactionModel.findByIdAndDelete(id);
    return { success: true };
  }
}
