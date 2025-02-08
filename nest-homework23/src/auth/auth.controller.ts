import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sing-in.dto';
import { IsAuthGuard } from './auth.guard';
import { User } from 'src/users/users.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    schema: {
      example: 'user registered successfully',
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: 'user already exists',
    },
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2E3NTM2YzdlOThjNTdhMWQ4MWZmZTgiLCJyb2xlIjoidXNlciIsInN1YnNjcmlwdGlvbiI6InByZW1pdW0iLCJpYXQiOjE3MzkwMzcyNzIsImV4cCI6MTczOTA0MDg3Mn0.sHJh2VPSXSOYLGXsPH6G07ABePRN0lMyoM6py4iNKYo',
      },
    },
  })
  @Post('sign-up')
  signUp(@Body() signUpdto: SignUpDto) {
    return this.authService.signUp(signUpdto);
  }

  @ApiBadRequestResponse({
    schema: {
      example: 'Email or Password is invalid',
    },
  })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@User() userId) {
    return this.authService.getCurrentUser(userId);
  }
}
