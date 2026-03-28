import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduledInstanceDocument = ScheduledInstance & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ScheduledInstance {
  @Prop({ required: true }) schedule_id: string;
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) year: number;
  @Prop({ required: true }) month: number;
  @Prop({ required: true }) due_date: string;
  @Prop({ required: true }) amount: number;
  @Prop({ enum: ['pending', 'paid', 'skipped'], default: 'pending' }) status: string;
  @Prop() paid_amount: number;
  @Prop() paid_date: string;
  @Prop() transaction_id: string;
  @Prop({ required: true }) created_by: string;
}

export const ScheduledInstanceSchema = SchemaFactory.createForClass(ScheduledInstance);
