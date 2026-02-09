import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class LiveMeterStatus {
    @PrimaryColumn()
    meterId: string;

    @Column('float')
    kwhConsumedAc: number;

    @Column('float')
    voltage: number;

    @Column('timestamp')
    lastHeartbeat: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
