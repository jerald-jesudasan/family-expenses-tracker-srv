import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investment, InvestmentDocument } from '../schemas/investment.schema';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

@Injectable()
export class InvestmentsService {
  constructor(@InjectModel(Investment.name) private model: Model<InvestmentDocument>) {}

  async getAll(familyId: string) {
    return (await this.model.find({ family_id: familyId }).lean()).map(toPlain);
  }

  async create(data: any, userId: string) {
    return toPlain((await this.model.create({ ...data, created_by: userId })).toObject());
  }

  async update(id: string, data: any) {
    return toPlain(await this.model.findByIdAndUpdate(id, data, { new: true }).lean());
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return { success: true };
  }
}
