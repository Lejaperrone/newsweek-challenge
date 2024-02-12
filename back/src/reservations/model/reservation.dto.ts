import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ReservationStatus } from '../enums/reservationStatus.enum';
import { PaymentType } from '../enums/paymentType.enum';

export class ReservationDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber({}, { message: 'El código debe ser un número válido' })
  @IsNotEmpty({ message: 'El código no puede ser nulo' })
  code: number;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  fullName: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'Formato de email inválido' })
  email: string;

  @IsNumber({}, { message: 'La cantidad de huéspedes debe ser un número' })
  @Min(1, { message: 'La cantidad de huéspedes mínima es 1' })
  @Max(12, { message: 'La cantidad de huéspedes máxima es 12' })
  @IsNotEmpty({ message: 'La cantidad de huéspedes es requerida' })
  numberOfGuests: number;

  @IsEnum(ReservationStatus, { message: 'Estado de reserva inválida' })
  @IsNotEmpty({ message: 'El estado de reserva es requerida' })
  status: ReservationStatus;

  @IsDateString({}, { message: 'El formato de fecha es incorrecto' })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  date: Date;

  @IsNotEmpty({ message: 'El monto es requerido' })
  amount: number;

  @IsNotEmpty({ message: 'El descuento es requerido' })
  discount: number;

  @IsEnum(PaymentType, { message: 'Tipo de pago inválido' })
  @IsNotEmpty({ message: 'El tipo de pago es requerido' })
  paymentType: PaymentType;

  @IsOptional()
  csvId: string;
}
