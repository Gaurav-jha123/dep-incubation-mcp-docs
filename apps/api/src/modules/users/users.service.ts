import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private buildEmailFromUsername(username: string) {
    const normalizedUsername = username.trim();

    const emailLocalPart = normalizedUsername
      .toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9._-]/g, '')
      .replace(/\.{2,}/g, '.')
      .replace(/^[._-]+|[._-]+$/g, '');

    if (!emailLocalPart) {
      throw new BadRequestException('Username must contain letters or numbers');
    }

    return {
      normalizedUsername,
      email: `${emailLocalPart}@example.com`,
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async createUser(username: string) {
    const { normalizedUsername, email } = this.buildEmailFromUsername(username);

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await this.prisma.user.create({
      data: {
        name: normalizedUsername,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return { user };
  }

  async updateUser(id: number, username: string) {
    const { normalizedUsername, email } = this.buildEmailFromUsername(username);

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    });

    if (existingUser && existingUser.id !== id) {
      throw new ConflictException('Email already registered');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: normalizedUsername,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return { user: updatedUser };
  }

  async removeUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const deletedUser = await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      message: 'User deleted successfully',
      user: deletedUser,
    };
  }
}
