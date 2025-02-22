import { TicketStatusEnum } from '../../common/enums/ticket-status-enum';
import { IsNotEmpty, IsString, IsIn, IsEmail, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsIn([TicketStatusEnum.CREATED, TicketStatusEnum.SUBMITTED])
  status: TicketStatusEnum;

  @IsOptional()
  @IsString()
  @IsEmail()
  assignee: string;
}
