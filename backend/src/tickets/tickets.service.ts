import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto, UpdateTicketDto, MoveTicketDto } from './tickets.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: string): Promise<Ticket> {
    const ticket = this.ticketsRepository.create({
      ...createTicketDto,
      creatorId: userId,
      lastUpdatedById: userId,
    });
    return this.ticketsRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      relations: ['project', 'creator', 'lastUpdatedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProject(projectId: string): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      where: { projectId },
      relations: ['creator', 'lastUpdatedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['project', 'creator', 'lastUpdatedBy'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, userId: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    
    Object.assign(ticket, updateTicketDto);
    ticket.lastUpdatedById = userId;
    
    return this.ticketsRepository.save(ticket);
  }

  async move(id: string, moveTicketDto: MoveTicketDto, userId: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    
    ticket.status = moveTicketDto.status;
    ticket.lastUpdatedById = userId;
    
    return this.ticketsRepository.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const result = await this.ticketsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Ticket not found');
    }
  }
}