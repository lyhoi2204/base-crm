import { Controller, Get, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import UserService from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  register(dataRegister: RegisterUserDto) {
    return this.userService.register(dataRegister);
  }
}
