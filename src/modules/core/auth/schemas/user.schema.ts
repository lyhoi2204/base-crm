import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import { Post, PostSchema } from 'src/modules/post/schemas/post.schema';
import { Role } from '../../roles/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  isAdmin: boolean;

  @Prop({ type: Date, default: new Date() })
  createdAt?: Date;

  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
