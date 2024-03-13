import { BaseDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({ timestamps: true })
export class BookingDocument extends BaseDocument {
  @Prop({ type: SchemaTypes.Date, required: true })
  startDate: Date;

  @Prop({ type: SchemaTypes.Date, required: true })
  endDate: Date;

  @Prop({ type: SchemaTypes.String, required: true })
  userId: string;

  @Prop({ type: SchemaTypes.String, required: true })
  houseId: string;

  @Prop({ type: SchemaTypes.String, required: true })
  invoiceId: string;
}

export const BookingSchema = SchemaFactory.createForClass(BookingDocument);
