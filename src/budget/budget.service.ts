import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncomeSource, IncomeSourceDocument } from '../schemas/income-source.schema';
import { ExpenseCategory, ExpenseCategoryDocument } from '../schemas/expense-category.schema';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(IncomeSource.name) private incomeSourceModel: Model<IncomeSourceDocument>,
    @InjectModel(ExpenseCategory.name) private expenseCategoryModel: Model<ExpenseCategoryDocument>,
  ) {}

  async getIncomeSources(familyId: string) {
    return (await this.incomeSourceModel.find({ family_id: familyId, is_active: true }).lean()).map(toPlain);
  }

  async createIncomeSource(data: any, userId: string) {
    return toPlain((await this.incomeSourceModel.create({ ...data, created_by: userId })).toObject());
  }

  async updateIncomeSource(id: string, data: any) {
    return toPlain(await this.incomeSourceModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async deleteIncomeSource(id: string) {
    await this.incomeSourceModel.findByIdAndUpdate(id, { is_active: false });
    return { success: true };
  }

  async getExpenseCategories(familyId: string) {
    return (await this.expenseCategoryModel.find({ family_id: familyId, is_active: true }).lean()).map(toPlain);
  }

  async createExpenseCategory(data: any, userId: string) {
    return toPlain((await this.expenseCategoryModel.create({ ...data, created_by: userId })).toObject());
  }

  async updateExpenseCategory(id: string, data: any) {
    return toPlain(await this.expenseCategoryModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async deleteExpenseCategory(id: string) {
    await this.expenseCategoryModel.findByIdAndUpdate(id, { is_active: false });
    return { success: true };
  }
}
