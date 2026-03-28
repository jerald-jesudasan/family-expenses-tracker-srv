import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Transaction {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true, enum: ['income', 'expense', 'transfer'] }) type: string;
  @Prop({ required: true }) amount: number;
  @Prop({ required: true }) date: string;
  @Prop({ required: true }) description: string;
  @Prop() account_id: string;
  @Prop() category_id: string;
  @Prop() income_source_id: string;
  @Prop() expense_record_id: string;
  @Prop({ enum: ['cash', 'bank', 'upi', 'card', 'cheque', 'other'] }) payment_mode: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
