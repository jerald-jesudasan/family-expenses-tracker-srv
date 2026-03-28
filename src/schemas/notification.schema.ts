import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Notification {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) user_id: string;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) message: string;
  @Prop({ enum: ['payment_due', 'payment_overdue', 'budget_alert', 'system', 'custom'], default: 'custom' }) type: string;
  @Prop({ enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' }) priority: string;
  @Prop({ default: false }) is_read: boolean;
  @Prop() linked_type: string;
  @Prop() linked_id: string;
  @Prop() action_url: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
