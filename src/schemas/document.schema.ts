import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentDocument = DocumentModel & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class DocumentModel {
  @Prop({ required: true }) family_id: string;
  @Prop({ required: true }) name: string;
  @Prop({ enum: ['identity', 'financial', 'insurance', 'property', 'vehicle', 'medical', 'legal', 'other'], default: 'other' }) category: string;
  @Prop() file_url: string;
  @Prop() file_name: string;
  @Prop() file_size: number;
  @Prop() mime_type: string;
  @Prop() linked_type: string;
  @Prop() linked_id: string;
  @Prop() member_id: string;
  @Prop() expiry_date: string;
  @Prop() notes: string;
  @Prop({ required: true }) created_by: string;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentModel);
