import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto, UpdateTicketDto, MoveTicketDto } from './tickets.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private notificationsGateway: NotificationsGateway,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    createTicketDto: CreateTicketDto,
    userId: string,
  ): Promise<Ticket> {
    const ticket = this.ticketsRepository.create({
      ...createTicketDto,
      creatorId: userId,
      lastUpdatedById: userId,
    });
    const savedTicket = await this.ticketsRepository.save(ticket);

    // Fetch with relations
    const fullTicket = await this.findOne(savedTicket.id);

    // Emit real-time event
    this.notificationsGateway.emitToProject(
      fullTicket.projectId,
      'ticket:created',
      fullTicket,
    );

    const activeUsers = this.notificationsGateway.getActiveUsers();
    const otherUsers = activeUsers.filter((u) => u !== userId);

    if (otherUsers.length > 0) {
      await this.notificationsService.notifyTicketCreated(
        fullTicket.id,
        fullTicket.projectId,
        fullTicket.creator.email,
        fullTicket.title,
        otherUsers,
      );
    }

    return fullTicket;
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

  async update(
    id: string,
    updateTicketDto: UpdateTicketDto,
    userId: string,
  ): Promise<Ticket> {
    const ticket = await this.findOne(id);
    Object.assign(ticket, updateTicketDto);
    ticket.lastUpdatedById = userId;
    const updatedTicket = await this.ticketsRepository.save(ticket);

    // Fetch with relations
    const fullTicket = await this.findOne(updatedTicket.id);

    // Emit real-time event
    this.notificationsGateway.emitToProject(
      fullTicket.projectId,
      'ticket:updated',
      fullTicket,
    );

    // Create notifications
    const activeUsers = this.notificationsGateway.getActiveUsers();
    const otherUsers = activeUsers.filter(u => u !== userId);
    
    if (otherUsers.length > 0) {
      await this.notificationsService.notifyTicketUpdated(
        fullTicket.id,
        fullTicket.projectId,
        fullTicket.lastUpdatedBy.email,
        fullTicket.title,
        otherUsers,
      );
    }

    return fullTicket;
  }

  async move(
    id: string,
    moveTicketDto: MoveTicketDto,
    userId: string,
  ): Promise<Ticket> {
    const ticket = await this.findOne(id);

    const oldStatus = ticket.status;
    ticket.status = moveTicketDto.status;
    ticket.lastUpdatedById = userId;

    const movedTicket = await this.ticketsRepository.save(ticket);

    // Fetch with relations
    const fullTicket = await this.findOne(movedTicket.id);

    // Emit real-time event with old and new status
    this.notificationsGateway.emitToProject(
      fullTicket.projectId,
      'ticket:moved',
      {
        ...fullTicket,
        oldStatus,
      },
    );

    // Create notifications
    const activeUsers = this.notificationsGateway.getActiveUsers();
    const otherUsers = activeUsers.filter(u => u !== userId);

    if (otherUsers.length > 0) {
      await this.notificationsService.notifyTicketMoved(
        fullTicket.id,
        fullTicket.projectId,
        fullTicket.lastUpdatedBy.email,
        fullTicket.title,
        moveTicketDto.status,
        otherUsers,
      );
    }

    return fullTicket;
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    const projectId = ticket.projectId;

    const result = await this.ticketsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Ticket not found');
    }

    // Emit real-time event
    this.notificationsGateway.emitToProject(projectId, 'ticket:deleted', {
      id,
    });
  }
}
