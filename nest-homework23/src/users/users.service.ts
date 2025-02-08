import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) throw new BadRequestException('user already exists');
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  findAll() {
    return this.userModel
      .find()
      .populate({ path: 'posts', select: '-user -password' });
  }

  async findOne(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('invalid id provided');
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async update(
    role: string,
    tokenId,
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    console.log(role, 'roleeeeeee');
    console.log(tokenId, 'tokenIddd');
    if (tokenId !== id && role !== 'admin')
      throw new UnauthorizedException('permition denied');
    if (!isValidObjectId(id))
      throw new BadRequestException('invalid id provided');
    if (role && role !== 'admin') {
      throw new UnauthorizedException('Only admin can update roles');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser)
      throw new BadRequestException('user could not be updated');
    return updatedUser;
  }

  async remove(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('invalid id provided');
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser)
      throw new BadRequestException('user could not be deleted');
    return deletedUser;
  }

  async updateSubscription(
    role: string,
    tokenId: string,
    id: string,
    subscription: string,
  ) {
    if (tokenId !== id && role !== 'admin')
      throw new UnauthorizedException('Permission denied');

    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid ID provided');

    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    user.subscriptionPlan = subscription;

    return user;
  }
}
