import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) name: string;
  @Prop() mobile: string;
  @Prop() avatar: string;
  @Prop() google_id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
