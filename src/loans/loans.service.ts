import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan, LoanDocument } from '../schemas/loan.schema';
import { LoanPayment, LoanPaymentDocument } from '../schemas/loan-payment.schema';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

@Injectable()
export class LoansService {
  constructor(
    @InjectModel(Loan.name) private loanModel: Model<LoanDocument>,
    @InjectModel(LoanPayment.name) private paymentModel: Model<LoanPaymentDocument>,
  ) {}

  async getLoans(familyId: string) {
    return (await this.loanModel.find({ family_id: familyId }).lean()).map(toPlain);
  }

  async createLoan(data: any, userId: string) {
    return toPlain((await this.loanModel.create({ ...data, created_by: userId })).toObject());
  }

  async updateLoan(id: string, data: any) {
    return toPlain(await this.loanModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async deleteLoan(id: string) {
    await this.loanModel.findByIdAndDelete(id);
    return { success: true };
  }

  async getPayments(loanId: string) {
    return (await this.paymentModel.find({ loan_id: loanId }).lean()).map(toPlain);
  }

  async addPayment(loanId: string, data: any, userId: string) {
    const payment = await this.paymentModel.create({ ...data, loan_id: loanId, created_by: userId });
    const loan = await this.loanModel.findById(loanId).lean() as any;
    if (loan) {
      const newOutstanding = Math.max(0, loan.outstanding_balance - (data.principal_component || data.amount));
      await this.loanModel.findByIdAndUpdate(loanId, {
        outstanding_balance: newOutstanding,
        total_paid: (loan.total_paid || 0) + data.amount,
        emi_paid_count: (loan.emi_paid_count || 0) + 1,
        status: newOutstanding <= 0 ? 'closed' : loan.status,
      });
    }
    return toPlain(payment.toObject());
  }
}
