import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PersonalLendingDocument = PersonalLending & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class PersonalLending {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true, enum: ['lent', 'borrowed'] }) lending_type: string;
  @Prop({ required: true }) person_name: string;
  @Prop() person_contact: string;
  @Prop({ required: true }) amount: number;
  @Prop({ default: 0 }) paid_amount: number;
  @Prop({ default: 0 }) outstanding_amount: number;
  @Prop({ required: true }) date: string;
  @Prop() due_date: string;
  @Prop({ default: 0 }) interest_rate: number;
  @Prop({ enum: ['active', 'settled', 'overdue'], default: 'active' }) status: string;
  @Prop() purpose: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const PersonalLendingSchema = SchemaFactory.createForClass(PersonalLending);
