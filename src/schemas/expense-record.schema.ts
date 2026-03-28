import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpenseRecordDocument = ExpenseRecord & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ExpenseRecord {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) category_id: string;
  @Prop({ required: true }) year: number;
  @Prop({ required: true }) month: number;
  @Prop({ required: true }) planned_amount: number;
  @Prop({ default: 0 }) spent_amount: number;
  @Prop({ enum: ['under', 'on_track', 'over'], default: 'under' }) status: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const ExpenseRecordSchema = SchemaFactory.createForClass(ExpenseRecord);
