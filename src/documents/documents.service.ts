import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentModel, DocumentDocument } from '../schemas/document.schema';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(DocumentModel.name) private model: Model<DocumentDocument>) {}

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
