import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['meterId', 'timestamp']) // Optimize for time-series queries per meter
export class MeterReading {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column()
    @Index()
    meterId: string;

    @Column('float')
    kwhConsumedAc: number;

    @Column('float')
    voltage: number;

    @Column('timestamp')
    timestamp: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    ingestedAt: Date;
}
