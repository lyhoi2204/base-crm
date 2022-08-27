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

  /**
   * Find Post by id
   * @param id
   */
  async findById(id) {
    return await this.postModel
      .findOne({ _id: new mongoose.Types.ObjectId(id) })
      .populate('author');
  }

  /**
   * Find All Posts
   */
  async findAllPost() {
    return await this.postModel.find().populate('author');
  }

  /**
   * List Posts by userId
   * @param user
   */
  async listMyPost(user) {
    return await this.postModel
      .find({ author: new mongoose.Types.ObjectId(user.userId) })
      .populate('author');
  }

  /**
   * Create Post
   * @param data
   * @param user
   */
  async cretePost(data: CreatePostDto, user) {
    const postCreated = new this.postModel({
      ...data,
      author: new mongoose.Types.ObjectId(user.userId),
    });
    return await postCreated.save();
  }

  /**
   * Update Post
   * @param id
   * @param data
   * @param user
   */
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

  /**
   * Delete Post
   * @param id
   * @param user
   */
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
