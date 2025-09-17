import { Type } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type TeamDocument = HydratedDocument<Team>

@Schema({timestamps:true})
export class Team{

    @Prop()
    name:string

    @Prop()
    coach:string

    @Prop({type:[{type: Types.ObjectId, ref:'Player'}],  default: [],})
    player: Types.ObjectId[]

    @Prop({type:[{type: Types.ObjectId, ref:'Tournament'}]})
    tournament: Types.ObjectId[]
   
}

export const TeamSchema = SchemaFactory.createForClass(Team)