import { IsEmail, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  otpCode: string;
}

export class VerifySuperUserDto {
  @IsString()
  password: string;
}

// Mock email service (logs OTP to console instead of sending real email)