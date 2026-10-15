import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.orderService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.orderService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch('confirm/:orderId')
  async confirm(@Param('orderId') orderId: string) {
    return this.orderService.confirmOrder(orderId);
  }

  @Patch('cancel/:orderId')
  async cancel(@Param('orderId') orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }
}