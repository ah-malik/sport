import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Team } from "src/team/schema/team.schema";

export type TournamentDocument = HydratedDocument<Tournament>

@Schema({timestamps:true})

export  class  Tournament{
    @Prop()
    name:string

    @Prop()
    location:string

    @Prop({type:[{type:Types.ObjectId,ref:'Team'}],unique:true})
    teams:Team[]
    
    @Prop({type:Date})
    startDate: Date

    @Prop({type:Date})
    endDate: Date

    @Prop({type:[{type:Types.ObjectId,ref:'User'}]})
    createdBy: Types.ObjectId[]


}

export const TournamentSchema =SchemaFactory.createForClass(Tournament)