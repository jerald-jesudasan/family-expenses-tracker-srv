import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvestmentDocument = Investment & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Investment {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) name: string;
  @Prop({ enum: ['mutual_fund', 'stocks', 'fd', 'rd', 'ppf', 'nps', 'gold', 'real_estate', 'crypto', 'other'], default: 'other' }) investment_type: string;
  @Prop({ required: true }) invested_amount: number;
  @Prop({ default: 0 }) current_value: number;
  @Prop() units: number;
  @Prop() nav: number;
  @Prop() interest_rate: number;
  @Prop({ required: true }) start_date: string;
  @Prop() maturity_date: string;
  @Prop() folio_number: string;
  @Prop() fund_house: string;
  @Prop({ enum: ['active', 'matured', 'redeemed'], default: 'active' }) status: string;
  @Prop({ enum: ['monthly', 'quarterly', 'annually', 'one_time'], default: 'one_time' }) frequency: string;
  @Prop() sip_amount: number;
  @Prop() nominee: string;
  @Prop() account_id: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);
