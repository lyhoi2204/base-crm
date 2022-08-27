import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  /**
   * Register user
   * @param data
   */
  async register(data: RegisterDto): Promise<User> {
    const checkUser = await this.findUserByEmail(data.email);
    if (checkUser) {
      throw new BadRequestException('Email already exists');
    }
    data.password = await bcrypt.hash(data.password, PASSWORD_SALT_OR_ROUNDS);
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  /**
   * Login
   * @param data
   */
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
    console.log(user, payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * validate user
   * @param email string
   * @param password string
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email, true);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * Find User by email
   * @param email string
   * @param selectPassword boolean
   */
  async findUserByEmail(email: string, selectPassword = false) {
    const selectFiled: any = {
      _id: true,
      name: true,
      email: true,
      isAdmin: true,
    };
    if (selectPassword) {
      selectFiled.password = true;
    }
    return await this.userModel
      .findOne(
        {
          email: email,
        },
        selectFiled,
      )
      .exec();
  }
}
