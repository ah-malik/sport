import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schema/team.schema';
import { UserModule } from 'src/user/user.module';
import { PlayerModule } from 'src/player/player.module';

@Module({
  imports:[
    UserModule,
    PlayerModule,
    MongooseModule.forFeature([{
         name:Team.name,schema:TeamSchema
       }])
  ],
  providers: [TeamService],
  controllers: [TeamController],
  exports:[TeamService, MongooseModule]
})
export class TeamModule {}
