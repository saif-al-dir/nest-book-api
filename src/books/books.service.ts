import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  // Get all books with authors
  public getAll(): Promise<Book[]> {
    return this.prisma.book.findMany({
      include: { author: true },
    });
  }

  // Get single book
  public async getById(id: Book['id']): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  // Create book
  public async create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    // Check if author exists
    const author = await this.prisma.author.findUnique({
      where: { id: data.authorId },
    });
    if (!author) throw new BadRequestException('Invalid authorId');

    try {
      return await this.prisma.book.create({
        data,
        include: { author: true },
      });
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException('Title is already taken');
      throw error;
    }
  }

  // Update book
  public async updateById(id: Book['id'], data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    // Ensure book exists
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    // Ensure author exists
    const author = await this.prisma.author.findUnique({
      where: { id: data.authorId },
    });
    if (!author) throw new BadRequestException('Invalid authorId');

    try {
      return await this.prisma.book.update({
        where: { id },
        data,
        include: { author: true },
      });
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException('Title is already taken');
      throw error;
    }
  }

  // Delete book
  public async deleteById(id: Book['id']): Promise<Book> {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
