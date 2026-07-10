import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { RegisterDto } from './dto/register.dto.js';
import type { UsersService } from 'src/users/users.service.js';
import type { EmailService } from './email.service.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
  ) { }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      verificationToken,
      verificationTokenExpiresAt,
    });

    void this.emailService.sendVerificationEmail(dto.email, verificationToken);

    const { passwordHash: password, ...results } = user;

    return {
      message:
        'Registration was successful. Please check your email to verify your account',
      data: results,
    };
  }
}
