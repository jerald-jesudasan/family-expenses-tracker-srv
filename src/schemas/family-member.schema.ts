import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FamilyMemberDocument = FamilyMember & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class FamilyMember {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) user_id: string;
  @Prop({ required: true, enum: ['admin', 'member'], default: 'member' }) role: string;
  @Prop({ required: true }) relationship: string;
  @Prop() invited_by: string;
  @Prop({ required: true }) created_by: string;
}

export const FamilyMemberSchema = SchemaFactory.createForClass(FamilyMember);
