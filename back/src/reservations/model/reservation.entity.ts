import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationStatus } from '../enums/reservationStatus.enum';
import { PaymentType } from '../enums/paymentType.enum';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: number;

  @Column({ length: 255 })
  fullName: string;

  @Column()
  email: string;

  @Column()
  numberOfGuests: number;

  @Column({ enum: ReservationStatus })
  status: ReservationStatus;

  @Column()
  date: Date;

  @Column({ default: 220 })
  amount: number;

  @Column({ default: 0 })
  discount: number;

  @Column()
  totalAmount: number;

  @Column({ enum: PaymentType })
  paymentType: PaymentType;

  @Column({ unique: true, nullable: true })
  csvId: string;

  @BeforeInsert()
  calculateTotalAmount?() {
    this.totalAmount = this.numberOfGuests * this.amount - this.discount;
  }
}
