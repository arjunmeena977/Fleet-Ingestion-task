import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { MeterReading } from '../database/entities/MeterReading.entity';
import { VehicleReading } from '../database/entities/VehicleReading.entity';
import { DevicePairing } from '../database/entities/DevicePairing.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MeterReading, VehicleReading, DevicePairing]),
    ],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
})
export class AnalyticsModule { }
