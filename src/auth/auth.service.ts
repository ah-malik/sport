import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/user/schema/user.schema';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/user/schema/token.schema';
import { LoginDTO } from 'src/user/dto/login.dto';
import { BlackListToken } from 'src/user/schema/blackListToken.schema';
import { ForgetDTO } from 'src/user/dto/ForgotPassword.dto';
import { ResetDto } from 'src/user/dto/resetPassword.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly configService: ConfigService,
        private jwtService: JwtService,
        @InjectModel(Token.name) private tokenModel: Model<Token>,
        @InjectModel(BlackListToken.name) private blackListModel: Model<BlackListToken>
    ) { }

    async register(data: UserDTO) {
        const checkEmail = await this.userModel.findOne({
            email: data.email,
        });
        if (checkEmail) throw new BadRequestException('Email already in use');
        const hash = await bcrypt.hash(data.password, 10);
        const createUser = new this.userModel({
            ...data,
            password: hash,
        });
        const userSave = await createUser.save();

        const payload = { sub: createUser._id, email: createUser.email };
        const access_token = await this.jwtService.signAsync(payload);
        const expireAt = new Date(Date.now() + 1000 * 60 * 60);

        await new this.tokenModel({
            token: access_token,
            expireAt: expireAt,
        }).save();

        const transport = await this.emailTransporter();
        await transport.sendMail({
            from: this.configService.get<string>('EMAIL_USER'),
            to: createUser.email,
            subject: 'Verify your email',
            text: `Hello ${createUser.name}`,
            html: `
        <p>Hello ${createUser.name},</p>
        <p>Click below to verify your account:</p>
        <a href="http://localhost:3000/auth/verify?token=${access_token}">
          Verify Email
        </a>
      `,
        });
        const obj = userSave.toObject()
        delete obj.password
        return obj;
    }

    async emailTransporter() {
        // Create a test account or replace with real credentials.
        return nodemailer.createTransport({
            port: 465,
            host: 'smtp.gmail.com',
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASSWORD'),
            },
        });
    }

    async verify(token: string) {
        try {
            const findToken = await this.tokenModel.findOne({ token })
            if (!findToken) throw new BadRequestException('Token not found or already used');

            if (findToken.expireAt <= new Date()) {
                throw new BadRequestException('Token not found or already used');
            }
            await this.tokenModel.deleteOne({ token })

            const verifyToken = await this.jwtService.verify(token, {
                secret: this.configService.get<string>('SECRET')
            })

            await this.userModel.findByIdAndUpdate(verifyToken.sub, {
                isVerified: true
            }, { new: true }).exec()


            return { message: 'Email verified successfully!' };
        } catch (error) {
            throw new BadRequestException('Invalid or expired token');
        }

    }
    async resendEmail(token: string) {
        const payload = this.jwtService.decode(token) as any
        const findUser = await this.userModel.findById(payload.sub)
        if (!findUser) throw new NotFoundException('User Nor Found')

        const newPayload = { sub: findUser._id, email: findUser.email }
        const access_token = await this.jwtService.signAsync(newPayload)
        const expireAt = new Date(Date.now() + 1000 * 60 * 60);

        await new this.tokenModel({
            token: access_token,
            expireAt: expireAt,
        }).save();

        const transport = await this.emailTransporter();
        await transport.sendMail({
            from: this.configService.get<string>('EMAIL_USER'),
            to: findUser.email,
            subject: 'Verify your email',
            text: `Hello ${findUser.name}`,
            html: `
        <p>Hello ${findUser.name},</p>
        <p>Click below to verify your account:</p>
        <a href="http://localhost:3000/auth/verify?token=${access_token}">
          Verify Email
        </a>
      `,
        });

        return { message: "Please check email we sent" }
    }



    async login(data: LoginDTO): Promise<{ user: any; token: any }> {
        const findUser = await this.userModel.findOne({ email: data.email }).exec();
        if (!findUser) throw new NotFoundException('Email/Password not match');
        const isMatch = await bcrypt.compare(data.password, findUser.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: findUser._id, email: findUser.email };
        const access_token = await this.jwtService.signAsync(payload);
        const obj = findUser.toObject()
        delete obj.password
        return { user: obj, token: access_token };
    }

    async logout(token: string) {
        await this.blackListModel.create({
            token,

        })

        return { message: 'You are Logout' };
    }

    async forgetPassword(data: ForgetDTO) {
        const checkUser = await this.userModel.findOne({ email: data.email })
        if (!checkUser) throw new NotFoundException('User Not Found')
        const payload = { sub: checkUser._id, email: checkUser.email }
        const token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: '15m',  // JWT auto expiry
        });

        const expireAt = new Date(Date.now() + 1000 * 60 * 15); // DB cleanup

        await this.tokenModel.create({
            token,
            expireAt
        })
        const transport = await this.emailTransporter();
        await transport.sendMail({
            from: this.configService.get<string>('EMAIL_USER'),
            to: checkUser.email,
            subject: ' Forget Reset Password ',
            text: `Hello ${checkUser.name}`,
            html: `
        <p>Hello ${checkUser.name},</p>
        <p>Click below to Forget Reset Password:</p>
        <a href="http://localhost:3000/auth/reset?token=${token}">
         reset password
        </a>
        <p>${token}</p>
      `,
        });


        return { checkUser: token }
    }

    async resetPassword(data: ResetDto, token: string) {
        const checkToken = await this.tokenModel.findOne({ token })
        if (!checkToken) throw new NotFoundException('Token expired or invalid. Please request a new password reset link.')
        if (checkToken.expireAt <= new Date()) {
            throw new NotFoundException('Token expired or invalid. Please request a new password reset link.')
        }

        const decode = await this.jwtService.verify(token, {
            secret: this.configService.get<string>('SECRET')
        })

        const hash = await bcrypt.hash(data.password, 10)

        await this.userModel.findByIdAndUpdate(decode.sub, {
            password: hash
        }, {
            new: true
        }).exec()

        await this.tokenModel.deleteOne({ token });


        return { message: "Password Reset done" }

    }


}
