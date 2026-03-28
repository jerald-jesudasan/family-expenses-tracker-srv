import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankAccount, BankAccountDocument } from '../schemas/bank-account.schema';
import { CreditCard, CreditCardDocument } from '../schemas/credit-card.schema';
import { CreditCardBill, CreditCardBillDocument } from '../schemas/credit-card-bill.schema';
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
export class AccountsService {
  constructor(
    @InjectModel(BankAccount.name) private bankAccountModel: Model<BankAccountDocument>,
    @InjectModel(CreditCard.name) private creditCardModel: Model<CreditCardDocument>,
    @InjectModel(CreditCardBill.name) private billModel: Model<CreditCardBillDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async getBankAccounts(familyId: string) {
    const docs = await this.bankAccountModel.find({ family_id: familyId, is_active: true }).sort({ is_primary: -1 }).lean();
    return docs.map(toPlain);
  }

  async getBankAccount(id: string) {
    return toPlain(await this.bankAccountModel.findById(id).lean());
  }

  async createBankAccount(data: any, userId: string) {
    const masked = data.account_number.slice(-4).padStart(data.account_number.length, 'X');
    const doc = await this.bankAccountModel.create({ ...data, account_number_masked: masked, created_by: userId });
    return toPlain(doc.toObject());
  }

  async updateBankAccount(id: string, data: any) {
    return toPlain(await this.bankAccountModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async deleteBankAccount(id: string) {
    await this.bankAccountModel.findByIdAndUpdate(id, { is_active: false });
    return { success: true };
  }

  async setPrimaryAccount(id: string, familyId: string) {
    await this.bankAccountModel.updateMany({ family_id: familyId }, { is_primary: false });
    await this.bankAccountModel.findByIdAndUpdate(id, { is_primary: true });
    return { success: true };
  }

  async getAccountsSummary(familyId: string) {
    const [accounts, cards] = await Promise.all([this.getBankAccounts(familyId), this.getCreditCards(familyId)]);
    const totalBankBalance = accounts.reduce((s: number, a: any) => s + (a.balance || 0), 0);
    const totalCreditLimit = cards.reduce((s: number, c: any) => s + c.credit_limit, 0);
    const totalOutstanding = cards.reduce((s: number, c: any) => s + (c.outstanding || 0), 0);
    const totalAvailable = cards.reduce((s: number, c: any) => s + (c.available_limit || 0), 0);
    return { accounts, cards, totalBankBalance, totalCreditLimit, totalOutstanding, totalAvailable, netCashPosition: totalBankBalance - totalOutstanding };
  }

  async getCreditCards(familyId: string) {
    const docs = await this.creditCardModel.find({ family_id: familyId, is_active: true }).lean();
    return docs.map(toPlain);
  }

  async getCreditCard(id: string) {
    return toPlain(await this.creditCardModel.findById(id).lean());
  }

  async createCreditCard(data: any, userId: string) {
    const doc = await this.creditCardModel.create({
      ...data,
      available_limit: data.credit_limit - (data.outstanding || 0),
      created_by: userId,
    });
    return toPlain(doc.toObject());
  }

  async updateCreditCard(id: string, data: any) {
    return toPlain(await this.creditCardModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async deleteCreditCard(id: string) {
    await this.creditCardModel.findByIdAndUpdate(id, { is_active: false });
    return { success: true };
  }

  async getCreditCardBills(creditCardId: string, year?: number, month?: number) {
    const query: any = { credit_card_id: creditCardId };
    if (year) query.year = year;
    if (month) query.month = month;
    const docs = await this.billModel.find(query).sort({ year: -1, month: -1 }).lean();
    return docs.map(toPlain);
  }

  async createCreditCardBill(data: any, userId: string, familyId: string) {
    const card = await this.creditCardModel.findById(data.credit_card_id).lean() as any;
    const billingDay = card?.billing_date || 1;
    const dueDay = card?.due_date || 15;
    const billingDate = new Date(data.year, data.month - 1, Math.min(billingDay, 28));
    let dueDate = new Date(data.year, data.month - 1, Math.min(dueDay, 28));
    if (dueDay < billingDay) dueDate = new Date(data.year, data.month, Math.min(dueDay, 28));

    const doc = await this.billModel.create({
      ...data,
      family_id: familyId,
      billing_date: billingDate.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      status: 'pending',
      paid_amount: 0,
      created_by: userId,
    });
    return toPlain(doc.toObject());
  }

  async updateCreditCardBill(id: string, data: any) {
    return toPlain(await this.billModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async payCreditCardBill(billId: string, paidAmount: number, fromAccountId: string | null, userId: string, familyId: string, notes?: string) {
    const bill = await this.billModel.findById(billId).lean() as any;
    const newPaidAmount = (bill.paid_amount || 0) + paidAmount;
    const newStatus = newPaidAmount >= bill.bill_amount ? 'paid' : 'partial';

    let transaction: any = null;
    if (fromAccountId) {
      transaction = await this.transactionModel.create({
        family_id: familyId,
        type: 'expense',
        amount: paidAmount,
        date: new Date().toISOString().split('T')[0],
        description: 'Credit Card Bill Payment',
        account_id: fromAccountId,
        payment_mode: 'bank',
        notes,
        created_by: userId,
      });

      const account = await this.bankAccountModel.findById(fromAccountId).lean() as any;
      if (account) {
        await this.bankAccountModel.findByIdAndUpdate(fromAccountId, { balance: (account.balance || 0) - paidAmount });
      }
    }

    const card = await this.creditCardModel.findById(bill.credit_card_id).lean() as any;
    if (card) {
      const newOutstanding = Math.max(0, (card.outstanding || 0) - paidAmount);
      await this.creditCardModel.findByIdAndUpdate(bill.credit_card_id, {
        outstanding: newOutstanding,
        available_limit: card.credit_limit - newOutstanding,
      });
    }

    const updatedBill = await this.billModel.findByIdAndUpdate(billId, {
      paid_amount: newPaidAmount,
      status: newStatus,
      paid_date: new Date().toISOString().split('T')[0],
      ...(transaction ? { transaction_id: transaction._id.toString() } : {}),
    }, { new: true }).lean();

    return { bill: toPlain(updatedBill), transaction: transaction ? toPlain(transaction.toObject()) : null };
  }

  async deleteCreditCardBill(id: string) {
    await this.billModel.findByIdAndDelete(id);
    return { success: true };
  }
}
