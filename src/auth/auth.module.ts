import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from '../schemas/user.schema';
import { Family, FamilySchema } from '../schemas/family.schema';
import { FamilyMember, FamilyMemberSchema } from '../schemas/family-member.schema';
import { FamilyInvitation, FamilyInvitationSchema } from '../schemas/family-invitation.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'fallback-secret'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Family.name, schema: FamilySchema },
      { name: FamilyMember.name, schema: FamilyMemberSchema },
      { name: FamilyInvitation.name, schema: FamilyInvitationSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
