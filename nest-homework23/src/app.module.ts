import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TestService } from './test/test.service';
import { AwsS3Module } from './aws-s3/aws-s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    PostsModule,
    AuthModule,
    AwsS3Module,
    
  ],
  controllers: [AppController],
  providers: [AppService, TestService],
})
export class AppModule {}
