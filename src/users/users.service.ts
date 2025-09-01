import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { password: true },
    });
  }

  async create(userData: { email: string }, password: string) {
    try {
      return await this.prisma.user.create({
        data: {
          ...userData,
          password: {
            create: { hashedPassword: password },
          },
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Email already taken');
      }
      throw e;
    }
  }

  async updateById(userId: string, userData: { email: string }, password?: string) {
    if (password) {
      return this.prisma.user.update({
        where: { id: userId },
        data: {
          ...userData,
          password: { update: { hashedPassword: password } },
        },
      });
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: userData,
    });
  }

  async deleteById(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
