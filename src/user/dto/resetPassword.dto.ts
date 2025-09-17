import { IsString,  MinLength } from "class-validator";



export class ResetDto {
 
     @IsString()
     @MinLength(6)
    password:string


}