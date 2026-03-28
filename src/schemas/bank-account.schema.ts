import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BankAccountDocument = BankAccount & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class BankAccount {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) bank_name: string;
  @Prop({ required: true }) account_number: string;
  @Prop() account_number_masked: string;
  @Prop({ enum: ['savings', 'current', 'salary', 'fd', 'rd', 'other'] }) account_type: string;
  @Prop({ default: 0 }) balance: number;
  @Prop() branch: string;
  @Prop() ifsc_code: string;
  @Prop() linked_debit_card: string;
  @Prop({ default: 0 }) min_balance: number;
  @Prop() color: string;
  @Prop({ default: false }) is_primary: boolean;
  @Prop({ default: true }) is_active: boolean;
  @Prop({ required: true }) created_by: string;
  @Prop() updated_by: string;
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);
