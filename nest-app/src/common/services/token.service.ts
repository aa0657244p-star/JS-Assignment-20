import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateToken(payload: any, secret: string, expiresIn: any = '1h') {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  verifyToken(token: string, secret: string) {
    return this.jwtService.verify(token, { secret });
  }
}