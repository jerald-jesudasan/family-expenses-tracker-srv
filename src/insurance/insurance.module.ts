import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';
import { Insurance, InsuranceSchema } from '../schemas/insurance.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Insurance.name, schema: InsuranceSchema }])],
  controllers: [InsuranceController],
  providers: [InsuranceService],
})
export class InsuranceModule {}
