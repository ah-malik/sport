import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";


export enum UserRole {
  ADMIN = 'admin',
  COACH = 'coach',
  PLAYER = 'player',
}
export class UserDTO {
    @IsString()
    name:string

    @IsEmail()
    email:string

    @IsString()
    @MinLength(6)
    password:string

     @IsEnum(UserRole, { message: 'Role must be coach, or player' })
  role: UserRole;
}