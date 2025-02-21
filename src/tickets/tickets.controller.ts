import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('/')
  async createTicket(@Body() createTicketDto: CreateTicketDto, @Req() req: Request) {
    const user = req['user'];

    return await this.ticketsService.createTicket({
      ...createTicketDto,
      createdBy: user,
      assignedEmail: createTicketDto.assignee,
    });
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async updateTicket(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() req: Request,
  ) {
    const user = req['user'];

    return await this.ticketsService.updateTicket({
      ...updateTicketDto,
      id: parseInt(id), 
      user,
      assignedEmail: updateTicketDto.assignee,
    });
  }
}
