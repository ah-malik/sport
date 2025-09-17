import { IsString, MinLength, IsOptional } from "class-validator";

export class ProfileUpdateDTO {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
