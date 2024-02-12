import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReservationDto } from './model/reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  getAllReservations(): Promise<ReservationDto[]> {
    return this.reservationsService.getAllReservations();
  }

  @Post()
  createReservation(@Body() reservationDto: ReservationDto): Promise<ReservationDto> {
    return this.reservationsService.createReservation(reservationDto);
  }

  @Put(':id')
  updateReservation(@Param('id') id: number, @Body() reservationDto: ReservationDto): Promise<ReservationDto> {
    return this.reservationsService.updateReservation(id, reservationDto);
  }

  @Delete(':id')
  deleteReservation(@Param('id') id: number): Promise<void> {
    return this.reservationsService.deleteReservation(id);
  }

  @Post('load-csv')
  @UseInterceptors(FileInterceptor('file'))
  async loadCSV(@UploadedFile() file: Express.Multer.File): Promise<CSVUploadResponse> {
    const fileBuffer = file.buffer;
    if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
      throw new BadRequestException('El archivo debe ser un CSV');
    }
    return await this.reservationsService.loadFromCSVBuffer(fileBuffer);
  }
}
