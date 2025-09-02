// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, Request, Response, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LocalAuthGuard } from './local-auth.guard';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ Register endpoint
  @Post('register')
  async register(@Body() registrationData: RegisterDTO) {
    return this.authService.register(registrationData);
  }

  // ✅ Login endpoint with LocalAuthGuard
 @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res: express.Response) {
    const tokens = await this.authService.createSession(req.user);
    res.cookie('auth', tokens, {
      httpOnly: true,
      sameSite: 'lax', // allow Postman
    });
    return res.json({ message: 'success' });
  }

  @UseGuards(LocalAuthGuard)
  @Delete('logout')
  async logout(@Response() res: express.Response) {
    res.clearCookie('auth', {httpOnly: true});
    return res.send({message: 'success'});
  }
}


