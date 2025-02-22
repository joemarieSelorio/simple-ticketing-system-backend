import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { UserRole } from '../common/enums/user-role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('audits')
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) { }
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
      return await this.auditsService.getAuditLogs({
        userId: parseInt(user.id),
        role: user.role,
        page,
        limit,
      });
    }
}
