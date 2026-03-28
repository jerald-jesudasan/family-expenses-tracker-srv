import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Family, FamilyDocument } from '../schemas/family.schema';
import { FamilyMember, FamilyMemberDocument } from '../schemas/family-member.schema';
import { FamilyInvitation, FamilyInvitationDocument } from '../schemas/family-invitation.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Family.name) private familyModel: Model<FamilyDocument>,
    @InjectModel(FamilyMember.name) private familyMemberModel: Model<FamilyMemberDocument>,
    @InjectModel(FamilyInvitation.name) private familyInvitationModel: Model<FamilyInvitationDocument>,
  ) {}

  async findOrCreateGoogleUser(profile: any): Promise<UserDocument> {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const googleId = profile.id;
    const avatar = profile.photos?.[0]?.value;

    let user = await this.userModel.findOne({ google_id: googleId });

    if (!user) {
      user = await this.userModel.findOne({ email });
      if (user) {
        user.google_id = googleId;
        if (!user.avatar && avatar) user.avatar = avatar;
        await user.save();
      }
    }

    if (!user) {
      user = await this.userModel.create({ email, name, google_id: googleId, avatar });

      const invitation = await this.familyInvitationModel.findOne({ email, status: 'pending' });

      if (invitation) {
        await this.familyMemberModel.create({
          family_id: invitation.family_id,
          user_id: user._id.toString(),
          role: invitation.role,
          relationship: invitation.relationship,
          invited_by: invitation.invited_by,
          created_by: user._id.toString(),
        });
        invitation.status = 'accepted';
        await invitation.save();
      } else {
        const family = await this.familyModel.create({
          name: `${name}'s Family`,
          owner_id: user._id.toString(),
          created_by: user._id.toString(),
        });
        await this.familyMemberModel.create({
          family_id: family._id.toString(),
          user_id: user._id.toString(),
          role: 'admin',
          relationship: 'Self',
          created_by: user._id.toString(),
        });
      }
    } else {
      // Ensure user has family membership
      const membership = await this.familyMemberModel.findOne({ user_id: user._id.toString() });
      if (!membership) {
        const family = await this.familyModel.create({
          name: `${user.name}'s Family`,
          owner_id: user._id.toString(),
          created_by: user._id.toString(),
        });
        await this.familyMemberModel.create({
          family_id: family._id.toString(),
          user_id: user._id.toString(),
          role: 'admin',
          relationship: 'Self',
          created_by: user._id.toString(),
        });
      }
    }

    return user;
  }

  async generateToken(user: UserDocument): Promise<string> {
    return this.jwtService.sign({ userId: user._id.toString(), email: user.email });
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) return null;

    const membership = await this.familyMemberModel.findOne({ user_id: userId }).lean();
    let family = null;
    if (membership) {
      family = await this.familyModel.findById(membership.family_id).lean();
    }

    return {
      user: this.toPublicUser(user),
      family: family ? this.toPublicFamily(family) : null,
      membership: membership ? this.toPublicMember(membership) : null,
    };
  }

  private toPublicUser(u: any) {
    return { id: u._id.toString(), email: u.email, name: u.name, mobile: u.mobile, avatar: u.avatar, created_at: u.created_at };
  }

  private toPublicFamily(f: any) {
    return { id: f._id.toString(), name: f.name, owner_id: f.owner_id, created_at: f.created_at };
  }

  private toPublicMember(m: any) {
    return { id: m._id.toString(), family_id: m.family_id, user_id: m.user_id, role: m.role, relationship: m.relationship, created_at: m.created_at };
  }
}
