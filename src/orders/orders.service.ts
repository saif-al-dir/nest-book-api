import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Get all orders
  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: { product: true },
    });
  }

  // Get order by ID
  async findOne(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { product: true },
    });
  }

  // Create a new order
 async create(data: { productId: number; quantity: number }) {
  // ✅ check product exists
  const product = await this.prisma.product.findUnique({ where: { id: data.productId } });
  if (!product) {
    throw new Error('Product not found');
  }

  return this.prisma.order.create({ data });
}


  // Delete an order
  async remove(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
