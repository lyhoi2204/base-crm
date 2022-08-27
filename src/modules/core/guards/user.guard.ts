import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const { headers } = request;
      if (!headers?.authorization) {
        throw new UnauthorizedException();
      }
      const token = headers.authorization.split(' ');
      if (token.length < 2 || token[0] != 'Bearer') {
        throw new UnauthorizedException();
      }
      const userJwt = await this.jwtService.verify(token[1]);
      const user = await this.authService.findUserByEmail(userJwt.email);
      if (!user) {
        throw new UnauthorizedException();
      }

      request.user = userJwt;

      return request;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
