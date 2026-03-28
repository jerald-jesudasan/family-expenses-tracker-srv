import { Controller, Get, Patch, Delete, Body, Param, Req, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamiliesService } from './families.service';

@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private familiesService: FamiliesService) {}

  @Get('current')
  getCurrent(@Req() req: any) {
    return this.familiesService.getCurrentFamily(req.user.userId);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.familiesService.getMembers(id);
  }

  @Post(':id/invite')
  invite(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.familiesService.invite(id, body, req.user.userId);
  }

  @Patch(':id/members/:memberId')
  updateMember(@Param('memberId') memberId: string, @Body() body: any) {
    return this.familiesService.updateMember(memberId, body);
  }

  @Delete(':id/members/:memberId')
  removeMember(@Param('memberId') memberId: string) {
    return this.familiesService.removeMember(memberId);
  }

  @Patch(':id')
  updateFamily(@Param('id') id: string, @Body() body: any) {
    return this.familiesService.updateFamily(id, body);
  }
}
