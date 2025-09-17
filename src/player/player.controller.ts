import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ROUTES } from 'src/constant/Routes';
import { PlayerDto } from './dto/player.dto';

@Controller('player')
export class PlayerController {
    constructor(
        private readonly playerService:PlayerService
    ){}

    @Get()
    all(){
        return this.playerService.all()
    }

    @Post(ROUTES.PLAYER.CREATE)
    create(@Body() data:PlayerDto){
        return this.playerService.create(data)
    }

     @Delete(ROUTES.PLAYER.DELETE)
    delete(@Param('id') id:string){
        return this.playerService.remove(id)
    }
    @Post(ROUTES.PLAYER.UPDATE)
    update(
    @Param('id') id:string,
    @Body() data:Partial<PlayerDto>){
        return this.playerService.update(data, id)
    }
}
