import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

export enum TicketStatus {
  PROPOSED = 'proposed',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  DEPLOYED = 'deployed',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'text',
    enum: TicketStatus,
    default: TicketStatus.PROPOSED,
  })
  status: TicketStatus;

  @ManyToOne(() => Project, (project) => project.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: string;

  @ManyToOne(() => User, (user) => user.createdTickets)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: string;

  @ManyToOne(() => User, (user) => user.updatedTickets, { nullable: true })
  @JoinColumn({ name: 'lastUpdatedById' })
  lastUpdatedBy: User;

  @Column({ nullable: true })
  lastUpdatedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}