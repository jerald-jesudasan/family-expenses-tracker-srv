import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InsuranceDocument = Insurance & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Insurance {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) policy_name: string;
  @Prop({ required: true }) insurer: string;
  @Prop({ required: true }) policy_number: string;
  @Prop({ enum: ['life', 'health', 'vehicle', 'home', 'travel', 'term', 'other'], default: 'other' }) insurance_type: string;
  @Prop({ required: true }) insured_member_id: string;
  @Prop({ required: true }) sum_assured: number;
  @Prop({ required: true }) premium_amount: number;
  @Prop({ enum: ['monthly', 'quarterly', 'half_yearly', 'annually'], default: 'annually' }) premium_frequency: string;
  @Prop({ required: true }) start_date: string;
  @Prop({ required: true }) maturity_date: string;
  @Prop() next_premium_date: string;
  @Prop() nominee: string;
  @Prop({ enum: ['active', 'expired', 'lapsed', 'claimed'], default: 'active' }) status: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const InsuranceSchema = SchemaFactory.createForClass(Insurance);
