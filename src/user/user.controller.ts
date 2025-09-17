import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ROUTES } from 'src/constant/Routes';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProfileUpdateDTO } from './dto/profileUpdate.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @UseGuards(AuthGuard)
    @Get(ROUTES.USER.PROFILE)
    profile(@Param('id') id:string)
    {
        return this.userService.userProfile(id)
    }    

    @UseGuards(AuthGuard)
    @Post(ROUTES.USER.UPDATE)
    update(@Param('id') id:string, @Body() data:Partial<ProfileUpdateDTO>,
     )
    {
        return this.userService.profileUpdate(id, data)
    }    

    

}
