import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Query 
} from '@nestjs/common';

import { TeamService } from './team.service';
import { TeamDTO } from './dto/team.dto';
import { ROUTES } from 'src/constant/Routes';

@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
  ) {}

  @Get()
  all(
    @Query('name') name: string,
    @Query('coach') coach: string,
    @Query('order') order: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.teamService.all({ name, coach, order, page, limit });
  }

  @Post(ROUTES.TEAM.CREATE)
  create(@Body() data: TeamDTO) {
    return this.teamService.create(data);
  }

  @Post(ROUTES.TEAM.UPDATE)
  update(
    @Body() data: Partial<TeamDTO>,
    @Param('id') id: string,
  ) {
    return this.teamService.update(data, id);
  }

  @Delete(ROUTES.TEAM.DELETE)
  delete(@Param('id') id: string) {
    return this.teamService.remove(id);
  }

  @Post(ROUTES.TEAM.PLAYER_ADD)
  addPlayer(
    @Param('id') id: string,
    @Body('player') player: string,
  ) {
    return this.teamService.addPlayer(id, player);
  }

  @Delete(ROUTES.TEAM.PLAYER_REMOVE)
  removePlayer(
    @Param('id') id: string,
    @Body('player') player: string,
  ) {
    return this.teamService.removePlayer(id, player);
  }
}
