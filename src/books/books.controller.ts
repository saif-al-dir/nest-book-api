import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdateBookDTO } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  // GET /api/books
  @Get('/')
  getAll() {
    return this.booksService.getAll();
  }

  // GET /api/books/:id
  @Get('/:id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.booksService.getById(id);
  }

  // POST /api/books
  // @UseGuards(JwtAuthGuard)
  @Post('/')
  create(@Body() bookData: CreateBookDTO) {
    return this.booksService.create(bookData);
  }

  // PUT /api/books/:id
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    return this.booksService.updateById(id, bookData);
  }

  // DELETE /api/books/:id
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.booksService.deleteById(id);
  }
}

