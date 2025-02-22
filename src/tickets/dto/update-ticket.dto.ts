import { TicketStatusEnum } from '../../common/enums/ticket-status-enum';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTicketDto {
  @ApiProperty({
    example: 'Leave request',
    description: 'The title of the ticket',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'I would like to request a leave for 2 days',
    description: 'The description of the ticket',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'created',
    description: 'status of the ticket',
  })
  @IsOptional()
  @IsEnum(TicketStatusEnum)
  status: TicketStatusEnum;

  @ApiProperty({
    example: 'admin@email.com',
    description: 'email of the admin assignee',
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  assignee: string;

  @ApiProperty({
    example: 'this is rejected',
    description: 'reason of rejection',
  })
  @IsOptional()
  @IsString()
  reasonOfRejection: string;
}
