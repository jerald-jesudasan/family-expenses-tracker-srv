import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('profile')
  updateProfile(@Req() req: any, @Body() body: any) {
    return this.usersService.update(req.user.userId, body);
  }
}
