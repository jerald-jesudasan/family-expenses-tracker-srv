import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoanPaymentDocument = LoanPayment & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class LoanPayment {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) loan_id: string;
  @Prop({ required: true }) payment_date: string;
  @Prop({ required: true }) amount: number;
  @Prop({ default: 0 }) principal_component: number;
  @Prop({ default: 0 }) interest_component: number;
  @Prop({ enum: ['emi', 'prepayment', 'part_payment'], default: 'emi' }) payment_type: string;
  @Prop() account_id: string;
  @Prop() transaction_id: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const LoanPaymentSchema = SchemaFactory.createForClass(LoanPayment);
