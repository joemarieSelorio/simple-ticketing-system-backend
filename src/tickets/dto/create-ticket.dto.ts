import { TicketStatusEnum } from '../../common/enums/ticket-status-enum';
import { IsNotEmpty, IsString, IsIn, IsEmail, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    example: 'Leave request',
    description: 'The title of the ticket',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
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
  @IsNotEmpty()
  @IsIn([TicketStatusEnum.CREATED, TicketStatusEnum.REQUESTED])
  status: TicketStatusEnum;

  @ApiProperty({
    example: 'admin@email.com',
    description: 'email of the admin assignee',
  })
  @IsOptional()
  @IsEmail()
  assignee: string;
}
