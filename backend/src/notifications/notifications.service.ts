import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    type: NotificationType,
    message: string,
    userId: string,
    ticketId?: string,
    projectId?: string,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      type,
      message,
      userId,
      ticketId,
      projectId,
    });

    const savedNotification = await this.notificationsRepository.save(notification);

    // Check if user is active
    const isActive = this.notificationsGateway.isUserActive(userId);

    if (isActive) {
      // Send real-time notification
      this.notificationsGateway.emitToAll('notification:new', {
        ...savedNotification,
        userId,
      });
    } else {
      // Mock email notification (log to console)
      this.sendEmailNotification(userId, message);
      savedNotification.emailSent = true;
      await this.notificationsRepository.save(savedNotification);
    }

    return savedNotification;
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50, // Last 50 notifications
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    await this.notificationsRepository.update(id, { isRead: true });
    const notification = await this.notificationsRepository.findOne({ where: { id } });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, isRead: false },
    });
  }

  private sendEmailNotification(userId: string, message: string) {
    // Mock email - log to console
    console.log('='.repeat(50));
    console.log('📧 EMAIL NOTIFICATION');
    console.log('To User ID:', userId);
    console.log('Message:', message);
    console.log('Time:', new Date().toISOString());
    console.log('='.repeat(50));
  }

  // Helper methods to create notifications for different events
  async notifyTicketCreated(
    ticketId: string,
    projectId: string,
    creatorEmail: string,
    ticketTitle: string,
    userIds: string[],
  ) {
    const message = `${creatorEmail} created ticket "${ticketTitle}"`;
    
    for (const userId of userIds) {
      await this.create(
        NotificationType.TICKET_CREATED,
        message,
        userId,
        ticketId,
        projectId,
      );
    }
  }

  async notifyTicketMoved(
    ticketId: string,
    projectId: string,
    moverEmail: string,
    ticketTitle: string,
    newStatus: string,
    userIds: string[],
  ) {
    const message = `${moverEmail} moved ticket "${ticketTitle}" to ${newStatus}`;
    
    for (const userId of userIds) {
      await this.create(
        NotificationType.TICKET_MOVED,
        message,
        userId,
        ticketId,
        projectId,
      );
    }
  }

  async notifyTicketUpdated(
    ticketId: string,
    projectId: string,
    updaterEmail: string,
    ticketTitle: string,
    userIds: string[],
  ) {
    const message = `${updaterEmail} updated ticket "${ticketTitle}"`;
    
    for (const userId of userIds) {
      await this.create(
        NotificationType.TICKET_UPDATED,
        message,
        userId,
        ticketId,
        projectId,
      );
    }
  }
}