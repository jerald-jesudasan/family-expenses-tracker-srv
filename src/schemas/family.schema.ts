import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FamilyDocument = Family & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Family {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) owner_id: string;
  @Prop({ required: true }) created_by: string;
}

export const FamilySchema = SchemaFactory.createForClass(Family);
