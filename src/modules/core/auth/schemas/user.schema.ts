import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../roles/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  isAdmin: boolean;

  @Prop({ type: Date, default: new Date() })
  createdAt?: Date;

  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
