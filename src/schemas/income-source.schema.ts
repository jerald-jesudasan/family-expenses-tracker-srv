import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncomeSourceDocument = IncomeSource & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class IncomeSource {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop({ required: true }) member_id: string;
  @Prop({ required: true }) amount: number;
  @Prop({ enum: ['monthly', 'quarterly', 'annually', 'one_time'], default: 'monthly' }) frequency: string;
  @Prop({ default: true }) is_active: boolean;
  @Prop({ required: true }) created_by: string;
}

export const IncomeSourceSchema = SchemaFactory.createForClass(IncomeSource);
