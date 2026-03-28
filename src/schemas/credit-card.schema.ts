import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CreditCardDocument = CreditCard & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class CreditCard {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) bank_name: string;
  @Prop({ required: true }) card_name: string;
  @Prop({ required: true }) card_number_masked: string;
  @Prop({ required: true }) credit_limit: number;
  @Prop({ default: 0 }) outstanding: number;
  @Prop({ default: 0 }) available_limit: number;
  @Prop() billing_date: number;
  @Prop() due_date: number;
  @Prop() color: string;
  @Prop({ default: true }) is_active: boolean;
  @Prop({ required: true }) created_by: string;
  @Prop() updated_by: string;
}

export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);
