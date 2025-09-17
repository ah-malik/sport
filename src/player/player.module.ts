import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schema/player.schema';

@Module({
  imports:[UserModule,
    MongooseModule.forFeature([{
      name:Player.name, schema:PlayerSchema
    }])
  ],
  providers: [PlayerService],
  controllers: [PlayerController],
  exports:[MongooseModule, PlayerService]
})
export class PlayerModule {}
