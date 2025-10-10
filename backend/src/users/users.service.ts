import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(email: string): Promise<User> {
    const user = this.usersRepository.create({ email });
    return this.usersRepository.save(user);
  }

  async updateOtp(userId: string, otpCode: string, otpExpiry: Date): Promise<void> {
    await this.usersRepository.update(userId, { otpCode, otpExpiry });
  }

  async clearOtp(userId: string): Promise<void> {
  const user = await this.usersRepository.findOne({ where: { id: userId } });
  if (user) {
    user.otpCode = null;
    user.otpExpiry = null;
    await this.usersRepository.save(user);
  }
    }

  async setActive(userId: string, isActive: boolean): Promise<void> {
    await this.usersRepository.update(userId, { isActive });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}