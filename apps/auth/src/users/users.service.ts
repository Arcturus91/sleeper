import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  async create(createUser: CreateUserDto) {
    return 'hey, created';
  }
}

//4:11 video 14
