import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sing-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp({ email, fullName, password }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) throw new BadRequestException('user already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({ email, fullName, password: hashedPassword });

    return 'user registered successfully';
  }

  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel.findOne({ email });
    if (!existUser)
      throw new BadRequestException('email or pasword is invalid');

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual)
      throw new BadRequestException('emailor password is invalid');

    const payLoad = {
      userId: existUser._id,
      role:existUser.role,
      subscription:existUser.subscriptionPlan
    };

    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    return { accessToken };
  }

  async getCurrentUser(userId) {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }
}
