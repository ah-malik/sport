import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type blackListTokenDocument = HydratedDocument<BlackListToken>

@Schema({timestamps:true,})

export class BlackListToken {
    @Prop()
    token :string

    @Prop({index:{expires:0}})
    expireAt: Date
}

export const BlackListTokenSchema = SchemaFactory.createForClass(BlackListToken)