import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const { price, discountPercent } = createProductDto;
    let finalPrice = price;
    if (discountPercent) {
      finalPrice = price - (price * discountPercent) / 100;
    }
    return this.productModel.create({
      ...createProductDto,
      finalPrice,
      createdBy: userId,
    });
  }

  async findAll() {
    return this.productModel
      .find()
      .populate('categoryId', 'name')
      .populate('brandId', 'name');
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('categoryId', 'name')
      .populate('brandId', 'name');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, data: Partial<CreateProductDto>, userId: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const price = data.price ?? product.price;
    const discountPercent = data.discountPercent ?? product.discountPercent;
    let finalPrice = price;
    if (discountPercent) {
      finalPrice = price - (price * discountPercent) / 100;
    }

    return this.productModel.findByIdAndUpdate(
      id,
      { ...data, finalPrice, updatedBy: userId },
      { new: true },
    );
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }

  async getProductsPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.productModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('categoryId', 'name')
        .populate('brandId', 'name'),
      this.productModel.countDocuments(),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}