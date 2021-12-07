import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserInfoDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  createUser(@Query() body: CreateUserInfoDto) {
    return this.usersService.createUser(body);
  }
}
