import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsAuthGuard } from 'src/auth/auth.guard';
import { Role } from './role.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { Subscribtion } from 'src/enums/subscription.enum';
import { Subscription } from './subscription.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CLIENT_RENEG_LIMIT } from 'tls';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(IsAuthGuard, RoleGuard)
  update(
    @Role() role,
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(role, req.userId, id, updateUserDto);
  }

  @UseGuards(IsAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  @UseGuards(IsAuthGuard, RoleGuard)
  updateSubscription(
    @Role() role,
    @Req() req,
    @Param('id') id: string,
    @Subscription() subscription,
  ) {
    return this.usersService.updateSubscription(
      role,
      req.userId,
      id,
      subscription,
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const path = Math.random().toString().slice(2);
    console.log(path, 'path');
    // const type = file.mimetype.split('/')[1];
    const filePath = `images/${path}`;
    console.log(filePath, 'filePath');
    console.log(file, 'file');
    return this.usersService.uploadFile(filePath, file);
  }

  @Post('getFile')
  getFileById(@Body('fileId') fileId) {
    // console.log(fileId, 'filkeUd');
    return this.usersService.getFile(fileId);
  }

  @Post('deleteFile')
  deleteFileById(@Body('fileId') fileId) {
    return this.usersService.deleteFileById(fileId);
  }
}
