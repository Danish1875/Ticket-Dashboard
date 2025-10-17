import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { TicketStatus } from './ticket.entity';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  projectId: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;
}

export class UpdateTicketDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;
}

export class MoveTicketDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;
}