import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AuthService } from '../core/auth/auth.service';
import { CreatePostDto } from './dto/post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly authService: AuthService,
  ) {}

  async findById(id) {
    return await this.postModel
      .findOne({ _id: new mongoose.Types.ObjectId(id) })
      .populate('author');
  }

  async findAllPost() {
    return await this.postModel.find().populate('author');
  }

  async listMyPost(user) {
    return await this.postModel
      .find({ author: new mongoose.Types.ObjectId(user.userId) })
      .populate('author');
  }

  async cretePost(data: CreatePostDto, user) {
    const postCreated = new this.postModel({
      ...data,
      author: new mongoose.Types.ObjectId(user.userId),
    });
    return await postCreated.save();
  }

  async updatePost(id, data, user) {
    const post = await this.postModel
      .findOne({
        _id: new mongoose.Types.ObjectId(id),
        author: user.userId,
      })
      .populate('author')
      .exec();
    if (!post) {
      throw new NotFoundException();
    }

    return await this.postModel.findOneAndUpdate({ _id: post._id }, data, {
      new: true,
    });
  }

  async deletePost(id, user) {
    return this.postModel
      .findOne({
        _id: new mongoose.Types.ObjectId(id),
        author: user.userId,
      })
      .remove()
      .exec();
  }
}
