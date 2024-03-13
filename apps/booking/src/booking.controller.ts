import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";

import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { AuthUser, JwtGuard, User } from "@app/common";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@AuthUser() user: User, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto, user._id);
  }

  @Get()
  find() {
    return this.bookingService.find({});
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.bookingService.remove(id);
  }
}
