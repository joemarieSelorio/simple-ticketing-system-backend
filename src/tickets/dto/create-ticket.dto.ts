
import { TicketStatusEnum } from '../../common/enums/ticket-status-enum';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsEmail } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(TicketStatusEnum)
  status: TicketStatusEnum;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
  
  @IsString()
  @IsEmail()
  assignee: string;
}

