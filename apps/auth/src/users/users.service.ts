import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import * as argon from "argon2";

import { UserDocument } from "./user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  private logger = new Logger(UserDocument.name);

  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      this.logger.warn(`User by email: ${createUserDto.email} was not found`);
      throw new BadRequestException("User already exists...");
    }
    const hashed = await argon.hash(createUserDto.password);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashed,
    });
    return (await newUser.save()).toJSON();
  }

  async find(filter: FilterQuery<UserDocument>): Promise<UserDocument[]> {
    return await this.userModel.find(filter).lean();
  }

  async findOne(_id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id }).lean();
    if (!user) {
      this.logger.warn(`User by _id: ${_id} was not found`);
      throw new NotFoundException("User not found...");
    }

    return user;
  }

  async validate(email: string, plainPassword: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) {
      this.logger.warn(`User by email: ${email} was not found`);
      throw new NotFoundException("User not found...");
    }

    const valid = await argon.verify(user.password, plainPassword);
    if (!valid) throw new UnauthorizedException("Invalid credentials...");

    return user;
  }
}
