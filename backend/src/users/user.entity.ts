import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Ticket } from '../tickets/ticket.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, type: 'text' })
  otpCode: string | null;

  @Column({ nullable: true, type: 'datetime' })
  otpExpiry: Date | null;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Project, (project) => project.creator)
  projects: Project[];

  @OneToMany(() => Ticket, (ticket) => ticket.creator)
  createdTickets: Ticket[];

  @OneToMany(() => Ticket, (ticket) => ticket.lastUpdatedBy)
  updatedTickets: Ticket[];
}