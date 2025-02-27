import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { GetAdminTicketsQueryDto } from './dto/get-admin-ticket.dto';
import { GetTicketsQueryDto } from './dto/get-tickets.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { query } from 'express';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('/')
  @ApiOperation({ summary: 'Create new ticket' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
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
  @ApiOperation({ summary: 'Update ticket' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
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
  @Get('/me')
  @ApiOperation({ summary: 'Get user requested tickets' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
  async getRequestedTickets(
    @Query() query: GetTicketsQueryDto,
    @Req() req: Request,
  ) {
    const user = req['user'];

    const {page, limit} = query;

    return await this.ticketsService.getUserTickets({
      userId: parseInt(user.id),
      page,
      limit,
    });
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('/admin')
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
  async getAssignedTickets(
    @Query() query: GetAdminTicketsQueryDto,
    @Req() req: Request,
  ) {
    const user = req['user'];
    const isAssignedBool = query?.assigned === 'true';

    return await this.ticketsService.getAllTickets({
      page: query.page,
      limit: query.limit,
      userId: parseInt(user.id),
      assigned: isAssignedBool,
    });
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('/priority')
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
  async setTicketPriorty() {
    return await this.ticketsService.updateTicketPriority();
  }
}
