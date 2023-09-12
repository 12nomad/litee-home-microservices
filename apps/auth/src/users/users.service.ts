import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '@app/common';
import * as argon from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DatabaseService) {}

  async createUser(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (userExists)
      throw new BadRequestException('E-mail address is already used...');

    const hashed = await argon.hash(createUserDto.password);
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashed },
    });
    return { ...user, password: '' };
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found...');

    const valid = await argon.verify(user.password, plainPassword);
    if (!valid) throw new UnauthorizedException('Invalid credentials...');

    return { sub: user.id, email: user.email };
  }

  async getUser(sub: number) {
    const user = await this.prisma.user.findUnique({ where: { id: sub } });
    if (!user) throw new BadRequestException('User not found...');

    return user;
  }
}
