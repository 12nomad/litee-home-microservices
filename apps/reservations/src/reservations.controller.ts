import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthUser, JwtAuthGuard } from '@app/common';

import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getReservations() {
    return this.reservationsService.getReservations();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.getReservation(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReservation(
    @AuthUser('id') id: number,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationsService.createReservation(id, createReservationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateReservation(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.updateReservation(id, updateReservationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.deleteReservation(id);
  }
}
