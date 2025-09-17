import { Type } from "class-transformer";
import { IsDate,  IsString } from "class-validator";


export class TournamentDTO {
    @IsString()
    name:string

    @IsString()
    location:string

    @IsDate()
    @Type(() => Date)   // 👈 important
    startDate:Date

    @IsDate()
     @Type(() => Date)   // 👈 important
    endDate:Date



}