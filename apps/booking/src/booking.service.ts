import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { BookingDocument } from "./booking.schema";

@Injectable()
export class BookingService {
  private logger = new Logger(BookingDocument.name);

  constructor(
    @InjectModel(BookingDocument.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<BookingDocument> {
    const newBooking = new this.bookingModel({
      ...createBookingDto,
      userId,
    });
    return (await newBooking.save()).toJSON();
  }

  async find(filter: FilterQuery<BookingDocument>): Promise<BookingDocument[]> {
    return await this.bookingModel.find(filter).lean();
  }

  async findOne(_id: string): Promise<BookingDocument> {
    return await this.bookingModel.findOne({ _id }).lean();
  }

  async update(_id: string, updateBookingDto: UpdateBookingDto) {
    const result = await this.bookingModel
      .findOneAndUpdate({ _id }, { $set: updateBookingDto }, { new: true })
      .lean();
    if (!result) {
      this.logger.warn(`Booking by _id: ${_id} was not found`);
      throw new NotFoundException();
    }

    return result;
  }

  async remove(_id: string) {
    const result = await this.bookingModel.findOneAndDelete({ _id }).lean();

    if (!result) {
      this.logger.warn(`Booking by _id: ${_id} was not found`);
      throw new NotFoundException();
    }

    return result;
  }
}
