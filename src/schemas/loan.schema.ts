import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoanDocument = Loan & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Loan {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) name: string;
  @Prop({ enum: ['home', 'car', 'personal', 'education', 'business', 'gold', 'other'], default: 'other' }) loan_type: string;
  @Prop({ required: true }) lender: string;
  @Prop({ required: true }) principal_amount: number;
  @Prop({ required: true }) interest_rate: number;
  @Prop({ required: true }) tenure_months: number;
  @Prop({ required: true }) emi_amount: number;
  @Prop({ required: true }) start_date: string;
  @Prop() end_date: string;
  @Prop({ required: true }) outstanding_balance: number;
  @Prop({ default: 0 }) total_paid: number;
  @Prop({ default: 0 }) emi_paid_count: number;
  @Prop({ required: true }) due_day: number;
  @Prop() account_id: string;
  @Prop({ enum: ['active', 'closed', 'overdue'], default: 'active' }) status: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);
