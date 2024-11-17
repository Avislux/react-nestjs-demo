import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
const prisma = new PrismaClient()

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, 
              private jwtService: JwtService) 
  {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException("The provided credentials are invalid.");
    } else {
      const payload = { sub: user.id, email: user.email };
      let token = await this.jwtService.signAsync(payload);
      return {
        access_token: token,
        name: user.name,
      };
    }
    
  }
}