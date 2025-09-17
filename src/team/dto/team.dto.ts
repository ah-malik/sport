import { Type } from "class-transformer";
import { IsDate,  IsString } from "class-validator";


export class TeamDTO {
    @IsString()
    name:string

    @IsString()
    coach:string


}