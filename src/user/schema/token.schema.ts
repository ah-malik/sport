import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type tokenDocument = HydratedDocument<Token>

@Schema({timestamps:true,})

export class Token {
    @Prop()
    token :string

    @Prop({index:{expires:0},type:Date})
    expireAt: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token)