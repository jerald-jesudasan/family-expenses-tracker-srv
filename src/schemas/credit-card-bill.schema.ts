import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CreditCardBillDocument = CreditCardBill & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class CreditCardBill {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) credit_card_id: string;
  @Prop({ required: true }) year: number;
  @Prop({ required: true }) month: number;
  @Prop({ required: true }) bill_amount: number;
  @Prop({ default: 0 }) paid_amount: number;
  @Prop({ enum: ['pending', 'partial', 'paid'], default: 'pending' }) status: string;
  @Prop() billing_date: string;
  @Prop() due_date: string;
  @Prop() paid_date: string;
  @Prop() transaction_id: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const CreditCardBillSchema = SchemaFactory.createForClass(CreditCardBill);
