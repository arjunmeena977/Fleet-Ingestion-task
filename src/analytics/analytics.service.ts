import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MeterReading } from '../database/entities/MeterReading.entity';
import { VehicleReading } from '../database/entities/VehicleReading.entity';
import { DevicePairing } from '../database/entities/DevicePairing.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(MeterReading)
        private meterReadingRepo: Repository<MeterReading>,
        @InjectRepository(VehicleReading)
        private vehicleReadingRepo: Repository<VehicleReading>,
        @InjectRepository(DevicePairing)
        private pairingRepo: Repository<DevicePairing>,
    ) { }

    async getDailyPerformance(vehicleId: string) {
        // 1. Find paired meter
        const pairing = await this.pairingRepo.findOne({ where: { vehicleId } });
        if (!pairing) {
            throw new NotFoundException(`No meter found for vehicle ${vehicleId}`);
        }

        // 2. Define time range (Last 24 hours)
        const end = new Date();
        const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

        // 3. Aggregate AC Consumed (Grid Side)
        const acResult = await this.meterReadingRepo
            .createQueryBuilder('meter')
            .select('MAX(meter.kwhConsumedAc) - MIN(meter.kwhConsumedAc)', 'totalAc')
            .where('meter.meterId = :meterId', { meterId: pairing.meterId })
            .andWhere('meter.timestamp BETWEEN :start AND :end', { start, end })
            .getRawOne();

        // 4. Aggregate DC Delivered (Vehicle Side)
        const dcResult = await this.vehicleReadingRepo
            .createQueryBuilder('vehicle')
            .select('MAX(vehicle.kwhDeliveredDc) - MIN(vehicle.kwhDeliveredDc)', 'totalDc')
            .addSelect('AVG(vehicle.batteryTemp)', 'avgTemp')
            .where('vehicle.vehicleId = :vehicleId', { vehicleId })
            .andWhere('vehicle.timestamp BETWEEN :start AND :end', { start, end })
            .getRawOne();

        const totalAc = parseFloat(acResult.totalAc) || 0;
        const totalDc = parseFloat(dcResult.totalDc) || 0;
        const avgTemp = parseFloat(dcResult.avgTemp) || 0;

        // 5. Calculate Efficiency
        // Avoid division by zero
        const efficiency = totalAc > 0 ? totalDc / totalAc : 0;

        return {
            vehicleId,
            period: '24h',
            totalEnergyConsumedAc: totalAc,
            totalEnergyDeliveredDc: totalDc,
            efficiencyRatio: Number(efficiency.toFixed(4)),
            averageBatteryTemp: Number(avgTemp.toFixed(2)),
        };
    }
}
