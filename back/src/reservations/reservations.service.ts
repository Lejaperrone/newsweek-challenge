import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './model/reservation.entity';
import * as papaparse from 'papaparse';
import { ValidationError, validate } from 'class-validator';
import { ReservationDto } from './model/reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>
  ) {}

  async getAllReservations(): Promise<ReservationDto[]> {
    return this.reservationRepository.find();
  }

  async getReservationById(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({
      id: id,
    });
    if (!reservation) {
      throw new NotFoundException(`No se encontro reserva con id ${id}`);
    }
    return reservation;
  }

  async verifyUniqueCode(code: number, excludingId?: number): Promise<void> {
    const existingReservation = await this.reservationRepository.findOneBy({ code });
    if (existingReservation && existingReservation.id !== excludingId) {
      throw new ConflictException(`Ya existe una reserva con el codigo ${code}`);
    }
  }

  async createReservation(reservationDto: ReservationDto): Promise<ReservationDto> {
    await this.verifyUniqueCode(reservationDto.code);
    const newReservation = this.reservationRepository.create(reservationDto);
    return await this.reservationRepository.save(newReservation);
  }

  async updateReservation(id: number, reservationDto: ReservationDto): Promise<ReservationDto> {
    const existingReservation = await this.getReservationById(id);
    await this.verifyUniqueCode(reservationDto.code, existingReservation.id);
    const updatedReservation = Object.assign(existingReservation, reservationDto);
    return await this.reservationRepository.save(updatedReservation);
  }

  async deleteReservation(id: number): Promise<void> {
    const reservation = await this.getReservationById(id);
    await this.reservationRepository.remove(reservation);
  }

  async loadFromCSVBuffer(buffer: Buffer): Promise<CSVUploadResponse> {
    const fileContent = buffer.toString();
    const reservationsErrors: ErrorRows[] = [];

    const result = await papaparse.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
    });

    if (!result.data) {
      throw new Error('Error parsing CSV file.');
    }

    const promises = result.data.map(async (row: ReservationRow, index: number) => {
      try {
        if (Object.values(row).some(value => value === undefined || value === null || value === '')) {
          reservationsErrors.push({
            row: index + 2,
            errorMessages: ['Datos incompletos'],
          });
          return;
        }

        const reservation = await this.reservationRepository.findOneBy({
          csvId: row.ID,
        });
        if (reservation) {
          reservationsErrors.push({
            row: index + 2,
            errorMessages: [`Ya existe una reserva relacionada a ese id ${row.ID}`],
          });
          return;
        }

        const reservationDto = this.mapRowToDto(row);
        const validationErrors = await validate(reservationDto);

        if (validationErrors.length > 0) {
          reservationsErrors.push({
            row: index + 2,
            errorMessages: this.extractErrorMessages(validationErrors),
          });
          return;
        }

        await this.createReservation(reservationDto);
      } catch (error) {
        reservationsErrors.push({
          row: index + 2,
          errorMessages: ['Ha ocurrido un error al procesar'],
        });
      }
    });

    await Promise.all(promises);

    return { errors: reservationsErrors.sort((a, b) => a.row - b.row) };
  }

  private mapRowToDto(row: ReservationRow): ReservationDto {
    const reservationDto = new ReservationDto();
    return Object.assign(reservationDto, {
      code: row['Reservation Code'],
      fullName: row['Full Name'],
      email: row.Email,
      numberOfGuests: row['Number of Guests'],
      status: row.Status?.replace(/\s/g, '').toUpperCase(),
      date: row.Date,
      amount: row.Amount,
      discount: row.Discount,
      totalAmount: row.Total,
      paymentType: row['Payment Type']?.replace(/\s/g, '').toUpperCase(),
      csvId: row.ID,
    });
  }

  private extractErrorMessages(validationErrors: ValidationError[]): string[] {
    return validationErrors.map(error => Object.values(error.constraints || {}).join(', '));
  }
}
