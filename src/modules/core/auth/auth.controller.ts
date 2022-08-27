import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserAuthGuard } from '../guards/user.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 200, description: '' })
  @ApiTags('Auth')
  @Post('/register')
  register(@Body() dataRegister: RegisterDto) {
    return this.authService.register(dataRegister);
  }

  @ApiOperation({ summary: 'Register' })
  @ApiResponse({
    status: 200,
    description: '',
  })
  @ApiTags('Auth')
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
