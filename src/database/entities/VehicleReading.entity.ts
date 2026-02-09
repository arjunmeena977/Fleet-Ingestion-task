import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['vehicleId', 'timestamp']) // Optimize for time-series queries per vehicle
export class VehicleReading {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column()
    @Index()
    vehicleId: string;

    @Column('float')
    soc: number;

    @Column('float')
    kwhDeliveredDc: number;

    @Column('float')
    batteryTemp: number;

    @Column('timestamp')
    timestamp: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    ingestedAt: Date;
}
