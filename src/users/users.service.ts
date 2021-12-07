import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { CreateUserInfoDto } from './dtos/create-user.dto';
import { Users } from './users.entity';
require('dotenv').config();

const QASet = {
  diabetes: 'DqnQZLFI07XA',
};
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async createUser(body: CreateUserInfoDto) {}
}
