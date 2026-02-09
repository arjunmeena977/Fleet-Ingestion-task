import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { MeterReading } from '../database/entities/MeterReading.entity';
import { VehicleReading } from '../database/entities/VehicleReading.entity';
import { LiveMeterStatus } from '../database/entities/LiveMeterStatus.entity';
import { LiveVehicleStatus } from '../database/entities/LiveVehicleStatus.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MeterReading,
            VehicleReading,
            LiveMeterStatus,
            LiveVehicleStatus,
        ]),
    ],
    controllers: [IngestionController],
    providers: [IngestionService],
})
export class IngestionModule { }
