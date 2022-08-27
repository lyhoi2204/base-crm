import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserAuthGuard } from './guards/user.guard';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() dataRegister: RegisterDto) {
    return this.authService.register(dataRegister);
  }

  @Post('/login')
  login(@Body() dataLogin: LoginDto) {
    return this.authService.login(dataLogin);
  }

  @Get('/me')
  @UseGuards(UserAuthGuard)
  getMe(@Request() req) {
    return this.authService.findUserByEmail(req.user.email);
  }
}
