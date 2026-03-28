import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Redirects to Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const token = await this.authService.generateToken(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    return this.authService.getMe(req.user.userId);
  }

  @Get('logout')
  logout(@Res() res: any) {
    return res.json({ message: 'Logged out' });
  }
}
