import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { ScheduledPayment, ScheduledPaymentSchema } from '../schemas/scheduled-payment.schema';
import { ScheduledInstance, ScheduledInstanceSchema } from '../schemas/scheduled-instance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduledPayment.name, schema: ScheduledPaymentSchema },
      { name: ScheduledInstance.name, schema: ScheduledInstanceSchema },
    ]),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
