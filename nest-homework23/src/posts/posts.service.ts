import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Post } from './schema/post.schema';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('post') private postModel: Model<Post>,
    @InjectModel('user') private userModel: Model<User>,
  ) {}
  
  async create(
    subscirption: string,
    userId: string,
    createPostDto: CreatePostDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('user not found');
    const postsCount = user.posts.length;
    console.log(subscirption,"subscription")
  
    if (subscirption === 'free' && postsCount >= 10)
      throw new BadRequestException('upgrade subscirption plan');
    if (subscirption === 'basic' && postsCount >= 100)
      throw new BadRequestException('upgrade subscirption plan');
    if (subscirption === 'premium' && postsCount >= 300)
      throw new BadRequestException('upgrade subscirption plan');
    const newPost = await this.postModel.create({
      ...createPostDto,
      user: user._id,
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      $push: { posts: newPost._id },
    });
    return newPost;
  }


  findAll() {
    return this.postModel
      .find()
      .populate({ path: 'user', select: '-posts -createdAt -__v' });
  }

  async findOne(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('invalid id is provided');
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('post wasnt found');
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('invalid id provided');
    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
      { new: true },
    );
    if (!updatedPost)
      throw new BadRequestException('user could not be updated');
    return updatedPost;
  }

  async remove(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('invalid id is provided');

    const deletedPost = await this.postModel.findByIdAndDelete(id);
    if (!deletedPost) throw new NotFoundException('not found');
    // await this.userModel.findByIdAndUpdate(userId, {
    //   $pull: { posts: deletedPost._id },
    // });
    return deletedPost;
  }
}
