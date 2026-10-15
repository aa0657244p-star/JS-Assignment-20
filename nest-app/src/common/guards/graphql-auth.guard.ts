import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GraphqlAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'mySuperSecretKey123',
      });
      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}