import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tournament } from './schema/tournament.schema';
import { Model } from 'mongoose';
import { TournamentDTO } from './dto/tournament.dto';
import { JwtService } from '@nestjs/jwt';
import { Team } from 'src/team/schema/team.schema';

@Injectable({

})
export class TournamentService {
    constructor(
        @InjectModel(Tournament.name) private tournamentModel: Model<Tournament>,
        private jwtService: JwtService,
        @InjectModel(Team.name) private teamModel: Model<Team>
    ) { }


    async create(data: TournamentDTO, token: string) {
        const decode = await this.jwtService.verify(token)

        const createTournament = (await this.tournamentModel.create({
            ...data,
            createdBy: decode.sub
        }))
        await createTournament.populate('createdBy');
        return createTournament.save()
    }

    async addTeam(teamId: string, id: string) {
        const checkTeam = await this.teamModel.findById(teamId)
        if (!checkTeam) throw new NotFoundException('Team Not Found')

        const findTournament = await this.tournamentModel.findByIdAndUpdate(
            id,
            { $addToSet: { teams: teamId } },
            { new: true }
        )
        if (!findTournament) throw new NotFoundException('Tournament Not Found')
        const findTeam = await this.teamModel.findByIdAndUpdate(
            teamId,
            { $addToSet: { tournament: id } },
            { new: true }
        )
        if (!findTeam) throw new NotFoundException('Tournament Not Found')

        return { message: "done", findTournament, findTeam }
    }

    async getTournament(id: string) {
        const findTournament = await this.tournamentModel.findById(id)
        if (!findTournament) throw new NotFoundException('Tournament Not Found')
        await findTournament.populate('createdBy');
        return findTournament
    }

    async update(data: Partial<TournamentDTO>, id: string, token: string) {
        const decode = await this.jwtService.verify(token)


        const update = await this.tournamentModel.findByIdAndUpdate(id, { ...data }, { new: true })
        if (!update) throw new NotFoundException('Tournament Not Found')
        if (update.createdBy.toString() !== decode.sub) {
            throw new UnauthorizedException("Your Not Authorized for this")
        }
        await update.populate('createdBy')
        return update
    }

    async delete(id: string, token: string) {
        const decode = await this.jwtService.verify(token)
        const deleteTournament = await this.tournamentModel.findByIdAndDelete(id)
        if (!deleteTournament) throw new NotFoundException('Tournament Not Found')
        if (deleteTournament.createdBy.toString() !== decode.sub) {
            throw new UnauthorizedException("Your Not Authorized for this")
        }
        return { message: "Delete Done" }
    }

    async all({ name, startDate, endDate, order, page = 1, limit = 10 }) {
        const filter: any = {}



        if (name) {
            filter.name = { $regex: name, $options: "i" }
        }
        if (startDate && endDate) {
            filter.startDate = {
                $gte: new Date(startDate),
                $lt: new Date(endDate),
            };
        } else if (startDate || endDate) {
            throw new NotFoundException("startDate aur endDate is lazim");
        }

        const pageNumber = Number(page) || 1
        const limitNumber = Number(limit) || 10
        const skip = (pageNumber - 1) * limitNumber

        let query = await this.tournamentModel
        .find(filter)
        .limit(limitNumber)
        .skip(skip)

        if (order === 'DESC') {
            let query = await this.tournamentModel.find(filter).sort({ name: -1 })

            return query
        }
        const total = await this.tournamentModel.countDocuments(filter);

        return {
            data: query,
            meta: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPage: Math.ceil(total / limitNumber)
            }
        }

    }
}
