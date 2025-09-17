import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TournamentModule } from './tournament/tournament.module';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:async (configService: ConfigService)=>({
        uri:configService.get<string>('DATABASE_URL')
        
      })
        
    }),
    UserModule, AuthModule, TournamentModule, TeamModule, PlayerModule, MatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
