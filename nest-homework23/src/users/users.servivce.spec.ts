import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<User>

  const mockUserModel = {}
  const userMock = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getModelToken(User.name),
        useValue: mockUserModel
      }],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel= module.get<Model<User>>(getModelToken(User.name))
  });

  describe('getById', () => {

  })
 
});

  