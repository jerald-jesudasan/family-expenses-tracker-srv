import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersonalLending, PersonalLendingDocument } from '../schemas/personal-lending.schema';
import { LendingPayment, LendingPaymentDocument } from '../schemas/lending-payment.schema';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

@Injectable()
export class LendingService {
  constructor(
    @InjectModel(PersonalLending.name) private lendingModel: Model<PersonalLendingDocument>,
    @InjectModel(LendingPayment.name) private paymentModel: Model<LendingPaymentDocument>,
  ) {}

  async getAll(familyId: string) {
    return (await this.lendingModel.find({ family_id: familyId }).lean()).map(toPlain);
  }

  async create(data: any, userId: string) {
    return toPlain((await this.lendingModel.create({ ...data, outstanding_amount: data.amount, created_by: userId })).toObject());
  }

  async update(id: string, data: any) {
    return toPlain(await this.lendingModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async delete(id: string) {
    await this.lendingModel.findByIdAndDelete(id);
    return { success: true };
  }

  async getPayments(lendingId: string) {
    return (await this.paymentModel.find({ lending_id: lendingId }).lean()).map(toPlain);
  }

  async addPayment(lendingId: string, data: any, userId: string) {
    const payment = await this.paymentModel.create({ ...data, lending_id: lendingId, created_by: userId });
    const lending = await this.lendingModel.findById(lendingId).lean() as any;
    if (lending) {
      const newPaid = (lending.paid_amount || 0) + data.amount;
      const newOutstanding = Math.max(0, lending.outstanding_amount - data.amount);
      await this.lendingModel.findByIdAndUpdate(lendingId, {
        paid_amount: newPaid,
        outstanding_amount: newOutstanding,
        status: newOutstanding <= 0 ? 'settled' : lending.status,
      });
    }
    return toPlain(payment.toObject());
  }
}
