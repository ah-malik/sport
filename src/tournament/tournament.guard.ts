import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class TournamentGuard implements CanActivate {
  constructor (
  private readonly jwtService:JwtService,
  @InjectModel(User.name) private userModel: Model<User>
){}
 async canActivate(
    context: ExecutionContext,
  ):Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']
    if(!authHeader) throw new NotFoundException('authHeader missing')
 
    const token = authHeader.split(' ')[1];
    if(!token) throw new NotFoundException('token missing')

    const decode = await this.jwtService.verify(token)
    const user = await this.userModel.findById(decode.sub)
    if(!user) throw new NotFoundException('User Not Found')
    if (!user.isVerified) {
        throw new ForbiddenException('Please verify email first');
      }


    return true;
  }
}
