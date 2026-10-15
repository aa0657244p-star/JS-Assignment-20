import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    const category = await this.categoryModel.create({
      ...createCategoryDto,
      createdBy: userId,
    });
    return category;
  }

  async findAll() {
    return this.categoryModel.find().populate('createdBy', 'fname email');
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, data: Partial<CreateCategoryDto>, userId: string) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      { ...data, updatedBy: userId },
      { new: true },
    );
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) throw new NotFoundException('Category not found');
    return { message: 'Category deleted successfully' };
  }
}