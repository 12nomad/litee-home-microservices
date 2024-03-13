import { BaseDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({ timestamps: true })
export class UserDocument extends BaseDocument {
  @Prop({
    type: SchemaTypes.String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
