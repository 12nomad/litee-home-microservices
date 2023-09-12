import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@app/common';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: DatabaseService) {}

  // FIXME:
  async createReservation(
    id: number,
    createReservationDto: CreateReservationDto,
  ) {
    return this.prisma.reservation.create({
      data: {
        ...createReservationDto,
        userId: id,
      },
    });
  }

  async getReservations() {
    return this.prisma.reservation.findMany();
  }

  async getReservation(id: number) {
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }

  async updateReservation(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    return this.prisma.reservation.update({
      where: { id },
      data: {
        ...updateReservationDto,
      },
    });
  }

  async deleteReservation(id: number) {
    return this.prisma.reservation.delete({
      where: { id },
    });
  }
}
