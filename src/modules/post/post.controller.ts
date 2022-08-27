import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { request } from 'https';
import { UserAuthGuard } from '../core/guards/user.guard';
import { Role } from '../core/roles/enums/role.enum';
import { Roles } from '../core/roles/roles.decorator';
import { RolesGuard } from '../core/guards/roles.guards';
import { CreatePostDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('/api/v1/posts')
@Injectable()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(UserAuthGuard)
  async index() {
    return this.postService.findAllPost();
  }

  @Get('my-post')
  @UseGuards(UserAuthGuard)
  async listMyPost(@Request() req) {
    return this.postService.listMyPost(req.user);
  }

  @Post()
  @UseGuards(UserAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async create(@Body() data: CreatePostDto, @Request() req) {
    return this.postService.cretePost(data, req.user);
  }
}
