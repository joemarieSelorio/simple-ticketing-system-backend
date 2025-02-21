
import { TicketStatusEnum } from '../../common/enums/ticket-status-enum';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsEmail } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  title: string;

  description: string;

  @IsEnum(TicketStatusEnum)
  status: TicketStatusEnum;

  @IsNumber()
  userId: number;
  
  @IsString()
  @IsEmail()
  assignee: string;

  @IsString()
  reasonOfRejection: string;
}

