import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpenseCategoryDocument = ExpenseCategory & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ExpenseCategory {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) name: string;
  @Prop() icon: string;
  @Prop() color: string;
  @Prop({ default: false }) is_fixed: boolean;
  @Prop({ default: false }) is_auto_linked: boolean;
  @Prop() linked_type: string;
  @Prop() linked_id: string;
  @Prop({ default: true }) is_active: boolean;
  @Prop({ required: true }) created_by: string;
}

export const ExpenseCategorySchema = SchemaFactory.createForClass(ExpenseCategory);
