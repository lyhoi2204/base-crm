import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../core/auth/auth.service';
import { CreatePostDto } from './dto/post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly authService: AuthService,
  ) {}

  async findAllPost() {
    return await this.postModel.find().populate('author');
  }

  async listMyPost(user) {
    const author = await this.authService.findUserByEmail(user.email);
    return await this.postModel.find({ author }).populate('author');
  }

  async cretePost(data: CreatePostDto, user) {
    const author = await this.authService.findUserByEmail(user.email);
    const postCreated = new this.postModel({ ...data, author });
    return await postCreated.save();
  }
}
