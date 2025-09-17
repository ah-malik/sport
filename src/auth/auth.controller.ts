import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/user/dto/user.dto';
import { ROUTES } from 'src/constant/Routes';
import { LoginDTO } from 'src/user/dto/login.dto';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { ForgetDTO } from 'src/user/dto/ForgotPassword.dto';
import { ResetDto } from 'src/user/dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post(ROUTES.AUTH.REGISTER)
    register(@Body() body: UserDTO) {
        return this.authService.register(body)
    }

    @Post(ROUTES.AUTH.LOGIN)
    login(@Body() data: LoginDTO) {
        return this.authService.login(data)
    }


    @UseGuards(AuthGuard)
    @Post(ROUTES.AUTH.LOGOUT)
    logout(@Req() req: Request) {
        const token = req.headers.authorization?.split(' ')[1]
        return this.authService.logout(token)

    }

    @Get(ROUTES.AUTH.VERIFY)
    async verify(@Query('token') token: string) {
        return this.authService.verify(token)
    }

    @UseGuards(AuthGuard)
    @Post(ROUTES.AUTH.RESEND)
    async resend(@Req() req: Request){
        const token = req.headers.authorization?.split(' ')[1]
        return this.authService.resendEmail(token)
    }

    @Post(ROUTES.AUTH.FORGET)
    async forget(@Body() body: ForgetDTO){
        return this.authService.forgetPassword(body)
    }
    
    @Post(ROUTES.AUTH.RESET)
    async reset(@Query('token') token: string , @Body() body : ResetDto){
   
        return this.authService.resetPassword(body,token)
    }

    @UseGuards(AuthGuard)
    @Get("test")
    check() {
        return "Hello"
    }
}
