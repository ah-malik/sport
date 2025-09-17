import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TournamentService } from './tournament.service';
import { TournamentDTO } from './dto/tournament.dto';
import { ROUTES } from 'src/constant/Routes';
import { AuthGuard } from 'src/auth/auth.guard';
import { TournamentGuard } from './tournament.guard';

@Controller('tournament')

    // @UseGuards(AuthGuard, TournamentGuard) 
    export class TournamentController {
    constructor(private readonly tournamentService: TournamentService) { }

    // 🏆 Create Tournament
    @Post(ROUTES.TOURNAMENT.CREATE)
    create(@Body() body: TournamentDTO, @Req() req: Request) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.tournamentService.create(body, token);
    }

    // 🏆 Get Tournament by ID
    @Get(ROUTES.TOURNAMENT.TOURNAMENT_PROFILE)
    getTournament(@Param('id') id: string) {
        return this.tournamentService.getTournament(id);
    }

    // 🏆 Update Tournament
    @Post(ROUTES.TOURNAMENT.UPDATE)
    update(
        @Body() body: Partial<TournamentDTO>,
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.tournamentService.update(body, id, token);
    }

    // 🏆 Delete Tournament
    @Post(ROUTES.TOURNAMENT.DELETE)
    delete(@Param('id') id: string, @Req() req: Request) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.tournamentService.delete(id, token);
    }

    // 🏆 Get All Tournaments with filters
    @Get()
    all(
        @Query('name') name: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('order') order: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.tournamentService.all({
            name,
            startDate,
            endDate,
            order,
            page,
            limit,
        });
    }

    @Post('add_team/:id')
    addTeam(
    @Param('id') id:string,    
    @Body('teamId') teamId: string ){
        
          console.log('Tournament ID:', id);
            console.log('Team ID from body:', teamId);
        return this.tournamentService.addTeam(teamId,id)
    }
}
