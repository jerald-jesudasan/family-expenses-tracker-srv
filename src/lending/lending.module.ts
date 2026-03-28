import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LendingController } from './lending.controller';
import { LendingService } from './lending.service';
import { PersonalLending, PersonalLendingSchema } from '../schemas/personal-lending.schema';
import { LendingPayment, LendingPaymentSchema } from '../schemas/lending-payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PersonalLending.name, schema: PersonalLendingSchema },
      { name: LendingPayment.name, schema: LendingPaymentSchema },
    ]),
  ],
  controllers: [LendingController],
  providers: [LendingService],
})
export class LendingModule {}
