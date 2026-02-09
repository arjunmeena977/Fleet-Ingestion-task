import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterReading } from '../database/entities/MeterReading.entity';
import { VehicleReading } from '../database/entities/VehicleReading.entity';
import { LiveMeterStatus } from '../database/entities/LiveMeterStatus.entity';
import { LiveVehicleStatus } from '../database/entities/LiveVehicleStatus.entity';

@Injectable()
export class IngestionService {
    private readonly logger = new Logger(IngestionService.name);

    constructor(
        @InjectRepository(MeterReading)
        private meterReadingRepo: Repository<MeterReading>,
        @InjectRepository(VehicleReading)
        private vehicleReadingRepo: Repository<VehicleReading>,
        @InjectRepository(LiveMeterStatus)
        private liveMeterRepo: Repository<LiveMeterStatus>,
        @InjectRepository(LiveVehicleStatus)
        private liveVehicleRepo: Repository<LiveVehicleStatus>,
    ) { }

    async processReadings(payload: any): Promise<void> {
        // Array handling if payload is a batch
        if (Array.isArray(payload)) {
            for (const item of payload) {
                await this.processSingleReading(item);
            }
        } else {
            await this.processSingleReading(payload);
        }
    }

    private async processSingleReading(data: any): Promise<void> {
        if (this.isMeterReading(data)) {
            await this.handleMeterReading(data);
        } else if (this.isVehicleReading(data)) {
            await this.handleVehicleReading(data);
        } else {
            this.logger.warn(`Unknown payload format: ${JSON.stringify(data)}`);
        }
    }

    private isMeterReading(data: any): boolean {
        return 'meterId' in data && 'kwhConsumedAc' in data;
    }

    private isVehicleReading(data: any): boolean {
        return 'vehicleId' in data && 'kwhDeliveredDc' in data;
    }

    private async handleMeterReading(data: any) {
        const { meterId, kwhConsumedAc, voltage, timestamp } = data;
        const ts = new Date(timestamp);

        // 1. History Path (Insert)
        const history = this.meterReadingRepo.create({
            meterId,
            kwhConsumedAc,
            voltage,
            timestamp: ts,
        });
        await this.meterReadingRepo.save(history);

        // 2. Live Path (Upsert)
        // Using save with a known ID (Primary Key) triggers an upsert if it exists
        const live = this.liveMeterRepo.create({
            meterId,
            kwhConsumedAc,
            voltage,
            lastHeartbeat: ts,
        });
        // Or use upsert explicitly for atomicity and clarity
        await this.liveMeterRepo.upsert(live, ['meterId']);
    }

    private async handleVehicleReading(data: any) {
        const { vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp } = data;
        const ts = new Date(timestamp);

        // 1. History Path (Insert)
        const history = this.vehicleReadingRepo.create({
            vehicleId,
            soc,
            kwhDeliveredDc,
            batteryTemp,
            timestamp: ts,
        });
        await this.vehicleReadingRepo.save(history);

        // 2. Live Path (Upsert)
        const live = this.liveVehicleRepo.create({
            vehicleId,
            soc,
            kwhDeliveredDc,
            batteryTemp,
            lastHeartbeat: ts,
        });
        await this.liveVehicleRepo.upsert(live, ['vehicleId']);
    }
}
