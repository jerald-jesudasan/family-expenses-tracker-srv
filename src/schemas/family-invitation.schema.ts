import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FamilyInvitationDocument = FamilyInvitation & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class FamilyInvitation {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true, enum: ['admin', 'member'], default: 'member' }) role: string;
  @Prop({ required: true }) relationship: string;
  @Prop() invited_by: string;
  @Prop({ required: true, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }) status: string;
  @Prop() token: string;
  @Prop() expires_at: string;
}

export const FamilyInvitationSchema = SchemaFactory.createForClass(FamilyInvitation);
