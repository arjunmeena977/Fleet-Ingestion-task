import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class DevicePairing {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Index()
    meterId: string;

    @Column({ unique: true })
    @Index()
    vehicleId: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
