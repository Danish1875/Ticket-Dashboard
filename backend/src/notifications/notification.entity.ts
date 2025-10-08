import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum NotificationType {
  TICKET_CREATED = 'ticket_created',
  TICKET_UPDATED = 'ticket_updated',
  TICKET_MOVED = 'ticket_moved',
  PROJECT_CREATED = 'project_created',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  message: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  ticketId: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  emailSent: boolean;

  @CreateDateColumn()
  createdAt: Date;
}