import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class LiveVehicleStatus {
    @PrimaryColumn()
    vehicleId: string;

    @Column('float')
    soc: number;

    @Column('float')
    kwhDeliveredDc: number;

    @Column('float')
    batteryTemp: number;

    @Column('timestamp')
    lastHeartbeat: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
