import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LendingPaymentDocument = LendingPayment & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class LendingPayment {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) lending_id: string;
  @Prop({ required: true }) amount: number;
  @Prop({ required: true }) payment_date: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const LendingPaymentSchema = SchemaFactory.createForClass(LendingPayment);
