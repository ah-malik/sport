import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Player } from './schema/player.schema';
import { PlayerDto } from './dto/player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<Player>,
  ) {}

  async create(data: PlayerDto) {
    const player = await this.playerModel.create(data);
    return player.save();
  }

  async all() {
    return this.playerModel.find();
  }

  async update(data: Partial<PlayerDto>, id: string): Promise<Player> {
    const player = await this.playerModel.findByIdAndUpdate(id, data, { new: true });
    if (!player) {
      throw new NotFoundException('Player Not Found');
    }
    return player;
  }

  async remove(id: string): Promise<{ message: string }> {
    const player = await this.playerModel.findByIdAndDelete(id);
    if (!player) {
      throw new NotFoundException('Player Not Found');
    }
    return { message: 'Player Deleted Successfully' };
  }
}
