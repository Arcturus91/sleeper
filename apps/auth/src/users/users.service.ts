import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async verifyUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return user;
  }

  async create(createUser: CreateUserDto) {
    await this.validateCreateUser(createUser);

    return this.prismaService.user.create({
      data: {
        ...createUser,
        password: await bcrypt.hash(createUser.password, 10),
      },
    });
  }

  private async validateCreateUser(createUser: CreateUserDto) {
    try {
      await this.prismaService.user.findFirstOrThrow({
        where: { email: createUser.email },
      });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('User already exist');
  }

  async getUser(getUser: GetUserDto) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id: +getUser.id },
    });
  }
}
