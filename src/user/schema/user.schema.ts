import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type userDocument = HydratedDocument<User>


@Schema({timestamps:true})

export class User{
    @Prop()
    name: string

    @Prop({unique :  true})
    email:string

    @Prop()
    password: string

    @Prop({default : false})
    isVerified:  boolean

     @Prop({ 
    type: String, 
    enum: ['admin', 'coach', 'player'], 
    default: 'player' 
  })
    role: 'admin' | 'coach' | 'player';
    
}

export const UserSchema = SchemaFactory.createForClass(User)