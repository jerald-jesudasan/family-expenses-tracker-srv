import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) return null;
    return { id: user._id.toString(), email: user.email, name: user.name, mobile: user.mobile, avatar: user.avatar, created_at: (user as any).created_at };
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return { id: user._id.toString(), email: user.email, name: user.name, mobile: user.mobile, avatar: user.avatar };
  }
}
