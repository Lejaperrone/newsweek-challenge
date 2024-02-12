import { PaymentType } from '../enums/PaymentTypeEnum';
import { ReservationStatus } from '../enums/ReservationStatusEnum';

export type Reservation = {
  id?: number;
  code: number;
  fullName: string;
  email: string;
  numberOfGuests: number;
  status: ReservationStatus;
  date: string;
  amount: number;
  discount: number;
  totalAmount: number;
  paymentType: PaymentType;
  csvId?: string;
};
