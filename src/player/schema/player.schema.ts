import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type PlayerDocument = HydratedDocument<Player>;

@Schema({ timestamps: true })
export class Player {
  @Prop()
  name: string;

  @Prop({
    type: String,
    enum: [
      "Batsman",
      "Bowler",
      "AllRounder",
      "WicketKeeper",
    ],
  })
  role: string;

  @Prop()
  age: number;

  @Prop({ type: Types.ObjectId, ref: "User" })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Team" })
  team: Types.ObjectId;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
