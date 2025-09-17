import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";



export class ForgetDTO {
 
      @IsEmail()
      @IsNotEmpty()
      email:string


}