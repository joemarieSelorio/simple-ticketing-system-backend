
import { TicketStatusEnum } from '../../common/enums/ticket-status-enum';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsEmail, IsOptional} from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(TicketStatusEnum)
  status: TicketStatusEnum;
  
  @IsOptional()
  @IsString()
  @IsEmail()
  assignee: string;

  @IsOptional()
  @IsString()
  reasonOfRejection: string;
}

