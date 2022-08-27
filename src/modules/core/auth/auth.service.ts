import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { PASSWORD_SALT_OR_ROUNDS } from 'src/config/constant';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<User> {
    data.password = await bcrypt.hash(data.password, PASSWORD_SALT_OR_ROUNDS);
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      email: user.email,
      userId: user._id,
      roles: user.isAdmin ? Role.Admin : Role.User,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findUserByEmail(email: string) {
    return await this.userModel
      .findOne({
        email: email,
      })
      .exec();
  }
}
