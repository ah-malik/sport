import { 
  BadRequestException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Team } from './schema/team.schema';
import { User } from 'src/user/schema/user.schema';
import { Player } from 'src/player/schema/player.schema';
import { TeamDTO } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
  ) {}

  async all({ name, coach, order, limit = 10, page = 1 }) {
    const filter: any = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (coach) {
      filter.coach = { $regex: coach, $options: 'i' };
    }

    const sortDirection = order === 'desc' ? -1 : 1;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const [findAll, total] = await Promise.all([
      this.teamModel
        .find(filter)
        .limit(limitNumber)
        .skip(skip)
        .sort({ name: sortDirection }),
      this.teamModel.countDocuments(filter),
    ]);

    if (total === 0) {
      throw new NotFoundException('Not Found');
    }

    return {
      data: findAll,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async create(data: TeamDTO) {
    const exists = await this.teamModel.findOne({ name: data.name });
    if (exists) {
      throw new Error('Team with this name already exists');
    }
    return this.teamModel.create(data);
  }

  async update(data: Partial<TeamDTO>, id: string): Promise<Team> {
    const updateTeam = await this.teamModel.findByIdAndUpdate(id, data, { new: true });
    if (!updateTeam) {
      throw new NotFoundException('Team not found');
    }
    return updateTeam;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.teamModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    return { message: 'Team deleted successfully' };
  }

  async addPlayer(id: string, playerId: any) {
    const findTeam = await this.teamModel.findById(id);
    if (!findTeam) {
      throw new NotFoundException('Team Not Found');
    }

    const findPlayer = await this.playerModel.findById(playerId);
    if (!findPlayer) {
      throw new NotFoundException('Player Not Found');
    }

    if (findTeam.player.includes(playerId)) {
      throw new BadRequestException('Player Already Added');
    }

    findTeam.player.push(playerId);
    await findTeam.save();

    return findTeam;
  }

  async removePlayer(id: string, playerId: any) {
    const findTeam = await this.teamModel.findById(id);
    if (!findTeam) {
      throw new NotFoundException('Team Not Found');
    }

    const findPlayer = await this.playerModel.findById(playerId);
    if (!findPlayer) {
      throw new NotFoundException('Player Not Found');
    }

    const playerIndex = findTeam.player.findIndex((p) => p.toString() === playerId);
    if (playerIndex === -1) {
      throw new BadRequestException('Player not found in this team');
    }

    findTeam.player.splice(playerIndex, 1);
    await findTeam.save();

    return findTeam;
  }
}
