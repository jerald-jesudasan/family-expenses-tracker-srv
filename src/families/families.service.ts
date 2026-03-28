import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Family, FamilyDocument } from '../schemas/family.schema';
import { FamilyMember, FamilyMemberDocument } from '../schemas/family-member.schema';
import { FamilyInvitation, FamilyInvitationDocument } from '../schemas/family-invitation.schema';
import { User, UserDocument } from '../schemas/user.schema';

function toPlain(doc: any) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

@Injectable()
export class FamiliesService {
  constructor(
    @InjectModel(Family.name) private familyModel: Model<FamilyDocument>,
    @InjectModel(FamilyMember.name) private memberModel: Model<FamilyMemberDocument>,
    @InjectModel(FamilyInvitation.name) private invitationModel: Model<FamilyInvitationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getCurrentFamily(userId: string) {
    const membership = await this.memberModel.findOne({ user_id: userId }).lean();
    if (!membership) return null;
    const family = await this.familyModel.findById(membership.family_id).lean();
    return family ? toPlain(family) : null;
  }

  async getMembers(familyId: string) {
    const members = await this.memberModel.find({ family_id: familyId }).lean();
    const result = [];
    for (const member of members) {
      const user = await this.userModel.findById(member.user_id).lean();
      result.push({
        ...toPlain(member),
        user: user ? { id: user._id.toString(), name: user.name, email: user.email, avatar: user.avatar } : null,
      });
    }
    return result;
  }

  async invite(familyId: string, data: any, invitedBy: string) {
    const doc = await this.invitationModel.create({
      family_id: familyId,
      email: data.email,
      role: data.role || 'member',
      relationship: data.relationship,
      invited_by: invitedBy,
      status: 'pending',
    });
    return toPlain(doc.toObject());
  }

  async updateMember(memberId: string, data: any) {
    const doc = await this.memberModel.findByIdAndUpdate(memberId, data, { new: true }).lean();
    return toPlain(doc);
  }

  async removeMember(memberId: string) {
    await this.memberModel.findByIdAndDelete(memberId);
    return { success: true };
  }

  async updateFamily(familyId: string, data: any) {
    const doc = await this.familyModel.findByIdAndUpdate(familyId, data, { new: true }).lean();
    return toPlain(doc);
  }
}
