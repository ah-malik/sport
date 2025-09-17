
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { BlackListToken } from 'src/user/schema/blackListToken.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
  private readonly config: ConfigService,
  @InjectModel(BlackListToken.name) private blackListModel:Model<BlackListToken>
    
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
   if (token) {
  const isBlacklisted = await this.blackListModel.findOne({ token });
  if (isBlacklisted) {
    throw new UnauthorizedException();
  }
}

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.config.get<string>('SECRET'),
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
