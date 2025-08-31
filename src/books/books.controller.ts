import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdateBookDTO } from './dto/update-book.dto';

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
  @Post('/')
  create(@Body() bookData: CreateBookDTO) {
    return this.booksService.create(bookData);
  }

  // PUT /api/books/:id
  @Put('/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    return this.booksService.updateById(id, bookData);
  }

  // DELETE /api/books/:id
  @Delete('/:id')
  deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.booksService.deleteById(id);
  }
}

