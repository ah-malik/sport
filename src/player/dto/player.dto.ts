import { IsString, IsInt, Min, Max, IsEnum } from "class-validator";

export enum PlayerRole {
  Batsman = "Batsman",
  Bowler = "Bowler",
  Allrounder = "Allrounder",
  WicketKeeper = "WicketKeeper",

}

export class PlayerDto {
  @IsString()
  name: string;

  @IsEnum(PlayerRole, {
    message: "Role must be one of: Batsman, Bowler, Allrounder, WicketKeeper, Captain, ViceCaptain, Coach, FieldingSpecialist",
  })
  role: PlayerRole;

  @IsInt()
  @Min(12)  // cricket players usually minimum 12-13 years hotay hain
  @Max(60)  // realistic upper limit
  age: number;
}
