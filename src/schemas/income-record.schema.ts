import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncomeRecordDocument = IncomeRecord & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class IncomeRecord {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) income_source_id: string;
  @Prop({ required: true }) year: number;
  @Prop({ required: true }) month: number;
  @Prop({ required: true }) planned_amount: number;
  @Prop({ default: 0 }) received_amount: number;
  @Prop({ enum: ['pending', 'partial', 'received'], default: 'pending' }) status: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const IncomeRecordSchema = SchemaFactory.createForClass(IncomeRecord);
