import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../schemas/notification.schema';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private model: Model<NotificationDocument>) {}

  async getAll(familyId: string, userId: string) {
    return (await this.model.find({ family_id: familyId, user_id: userId }).sort({ created_at: -1 }).lean()).map(toPlain);
  }

  async markRead(id: string) {
    return toPlain(await this.model.findByIdAndUpdate(id, { is_read: true }, { new: true }).lean());
  }

  async markAllRead(familyId: string, userId: string) {
    await this.model.updateMany({ family_id: familyId, user_id: userId, is_read: false }, { is_read: true });
    return { success: true };
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return { success: true };
  }
}
