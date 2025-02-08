import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/enums/roles.enum';
import { Subscribtion } from 'src/enums/subscription.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  fullName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: string;

  @Prop({ type: String, enum: Subscribtion, default: Subscribtion.FREE })
  subscriptionPlan: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'post', default: [] })
  posts: mongoose.Schema.Types.ObjectId[];
}

export const userSchema = SchemaFactory.createForClass(User);
