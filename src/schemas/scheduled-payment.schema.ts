import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduledPaymentDocument = ScheduledPayment & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ScheduledPayment {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) name: string;
  @Prop() icon: string;
  @Prop({ enum: ['emi', 'subscription', 'utility', 'insurance', 'investment', 'rent', 'other'], default: 'other' }) category: string;
  @Prop({ enum: ['monthly', 'quarterly', 'half_yearly', 'annually', 'custom'], default: 'monthly' }) frequency: string;
  @Prop({ type: [Number] }) due_months: number[];
  @Prop({ required: true }) due_day: number;
  @Prop({ default: 0 }) amount: number;
  @Prop({ default: false }) is_variable: boolean;
  @Prop({ default: false }) is_auto_linked: boolean;
  @Prop() linked_type: string;
  @Prop() linked_id: string;
  @Prop({ required: true }) start_date: string;
  @Prop() end_date: string;
  @Prop({ default: true }) is_active: boolean;
  @Prop({ required: true }) created_by: string;
}

export const ScheduledPaymentSchema = SchemaFactory.createForClass(ScheduledPayment);
