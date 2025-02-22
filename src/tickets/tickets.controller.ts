import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuditsService } from '../audits/audits.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('/')
  async createTicket(@Body() createTicketDto: CreateTicketDto, @Req() req: Request) {
    const user = req['user'];
    const result = await this.ticketsService.createTicket({
      ...createTicketDto,
      createdBy: user,
      assignedEmail: createTicketDto?.assignee,
    });

    return result;
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async updateTicket(
    @Param('id') id: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() req: Request,
  ) {
    const user = req['user'];
    return await this.ticketsService.updateTicket({
      id,
      user,
      assignedEmail: updateTicketDto.assignee,
      ...updateTicketDto,
    });
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('/')
  async getSubmittedTickets(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: Request,
  ) {
    const user = req['user'];

    return await this.ticketsService.getUserTickets({
      userId: parseInt(user.id),
      page,
      limit,
    });
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('/admin/assigned')
  async getAssignedTickets(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: Request,
  ) {
    const user = req['user'];
    return await this.ticketsService.getAssignedTickets({
      adminUserId: parseInt(user.id),
      page,
      limit,
    });
  }
}
