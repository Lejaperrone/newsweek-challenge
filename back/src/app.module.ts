import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations/reservations.controller';
import { ReservationsService } from './reservations/reservations.service';
import { Reservation } from './reservations/model/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Reservation],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Reservation]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class AppModule {}
