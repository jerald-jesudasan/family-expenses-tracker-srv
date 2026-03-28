import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { Family, FamilySchema } from '../schemas/family.schema';
import { FamilyMember, FamilyMemberSchema } from '../schemas/family-member.schema';
import { FamilyInvitation, FamilyInvitationSchema } from '../schemas/family-invitation.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Family.name, schema: FamilySchema },
      { name: FamilyMember.name, schema: FamilyMemberSchema },
      { name: FamilyInvitation.name, schema: FamilyInvitationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FamiliesController],
  providers: [FamiliesService],
})
export class FamiliesModule {}
