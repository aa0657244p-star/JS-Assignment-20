import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
  ) {}

  async create(createBrandDto: CreateBrandDto, userId: string) {
    return this.brandModel.create({ ...createBrandDto, createdBy: userId });
  }

  async findAll() {
    return this.brandModel.find().populate('createdBy', 'fname email');
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: string, data: Partial<CreateBrandDto>, userId: string) {
    const brand = await this.brandModel.findByIdAndUpdate(
      id,
      { ...data, updatedBy: userId },
      { new: true },
    );
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async remove(id: string) {
    const brand = await this.brandModel.findByIdAndDelete(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return { message: 'Brand deleted successfully' };
  }
}