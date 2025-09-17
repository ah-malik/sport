import { Module } from '@nestjs/common';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament, TournamentSchema } from './schema/tournament.schema';
import { UserModule } from 'src/user/user.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports:[
    UserModule,TeamModule,
    MongooseModule.forFeature([{
      name:Tournament.name,schema:TournamentSchema
    }])
  ],
  controllers: [TournamentController],
  providers: [TournamentService]
})
export class TournamentModule {}
