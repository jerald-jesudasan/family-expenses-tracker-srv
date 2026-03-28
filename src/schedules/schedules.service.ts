import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduledPayment, ScheduledPaymentDocument } from '../schemas/scheduled-payment.schema';
import { ScheduledInstance, ScheduledInstanceDocument } from '../schemas/scheduled-instance.schema';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(ScheduledPayment.name) private scheduleModel: Model<ScheduledPaymentDocument>,
    @InjectModel(ScheduledInstance.name) private instanceModel: Model<ScheduledInstanceDocument>,
  ) {}

  async getSchedules(familyId: string) {
    return (await this.scheduleModel.find({ family_id: familyId, is_active: true }).lean()).map(toPlain);
  }

  async createSchedule(data: any, userId: string) {
    return toPlain((await this.scheduleModel.create({ ...data, created_by: userId })).toObject());
  }

  async updateSchedule(id: string, data: any) {
    return toPlain(await this.scheduleModel.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async deleteSchedule(id: string) {
    await this.scheduleModel.findByIdAndUpdate(id, { is_active: false });
    return { success: true };
  }

  async getInstances(familyId: string, year: number, month: number) {
    return (await this.instanceModel.find({ family_id: familyId, year, month }).lean()).map(toPlain);
  }

  async payInstance(id: string, data: any) {
    return toPlain(await this.instanceModel.findByIdAndUpdate(id, {
      status: 'paid',
      paid_amount: data.amount,
      paid_date: new Date().toISOString().split('T')[0],
    }, { new: true }).lean());
  }
}
