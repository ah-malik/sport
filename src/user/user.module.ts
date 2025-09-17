import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Token, TokenSchema } from './schema/token.schema';
import { BlackListToken, BlackListTokenSchema } from './schema/blackListToken.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:User.name, schema: UserSchema},
    {name:Token.name, schema: TokenSchema},
    {name: BlackListToken.name, schema: BlackListTokenSchema}
  ]),
  JwtModule.registerAsync({
      global: true,
      inject:[ConfigService],
      useFactory:(config: ConfigService)=>({
        secret: config.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      })
    }),],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService, MongooseModule]
})
export class UserModule {}
