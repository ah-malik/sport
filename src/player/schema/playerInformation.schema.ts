import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type PlayerInfoDocument = HydratedDocument<PlayerInfo>;

@Schema({ timestamps: true })
export class PlayerInfo {


 

}

export const PlayerInfoSchema = SchemaFactory.createForClass(PlayerInfo);
