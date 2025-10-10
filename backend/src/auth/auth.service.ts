import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Generate random 6-digit OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(email: string): Promise<{ message: string }> {
    // Find or create user
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create(email);
    }

    // Generate OTP and setting the expiry
    const otpCode = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.usersService.updateOtp(user.id, otpCode, otpExpiry);

    // Mock email - log to console
    console.log('='.repeat(50));
    console.log('📧 EMAIL SENT TO:', email);
    console.log('🔐 OTP CODE:', otpCode);
    console.log('⏰ EXPIRES AT:', otpExpiry);
    console.log('='.repeat(50));

    return { message: 'OTP sent to email (check console)' };
  }

  async verifyOtp(email: string, otpCode: string): Promise<{ accessToken: string; user: any }> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.otpCode || !user.otpExpiry) {
      throw new UnauthorizedException('Invalid OTP or email');
    }

    // Check if OTP expired
    if (new Date() > user.otpExpiry) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Check if OTP matches
    if (user.otpCode !== otpCode) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP and set user as active
    await this.usersService.clearOtp(user.id);
    await this.usersService.setActive(user.id, true);

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async verifySuperUserPassword(password: string): Promise<{ valid: boolean }> {
    const correctPassword = process.env.SUPER_USER_PASSWORD || 'admin123';
    return { valid: password === correctPassword };
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, email: user.email };
  }
}