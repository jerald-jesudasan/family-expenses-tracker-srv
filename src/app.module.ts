import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FamiliesModule } from './families/families.module';
import { AccountsModule } from './accounts/accounts.module';
import { BudgetModule } from './budget/budget.module';
import { MonthlyModule } from './monthly/monthly.module';
import { SchedulesModule } from './schedules/schedules.module';
import { LoansModule } from './loans/loans.module';
import { InvestmentsModule } from './investments/investments.module';
import { InsuranceModule } from './insurance/insurance.module';
import { LendingModule } from './lending/lending.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/family-expenses'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    FamiliesModule,
    AccountsModule,
    BudgetModule,
    MonthlyModule,
    SchedulesModule,
    LoansModule,
    InvestmentsModule,
    InsuranceModule,
    LendingModule,
    DocumentsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
