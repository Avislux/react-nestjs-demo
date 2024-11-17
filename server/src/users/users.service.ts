import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient()
@Injectable()
export class UsersService {
  async findOne(email: string): Promise<User | undefined> {
    const user = await prisma.user.findFirstOrThrow(
      { where: { email: email } },
    );
    return user ?? null;
  }
}
