import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  NotFoundException,
  ParseUUIDPipe,
  UseGuards
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDTO } from './dto/create-author.dto';
import { UpdateAuthorDTO } from './dto/update-author.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  // GET /api/authors
  @Get('/')
  getAll() {
    return this.authorsService.getAll();
  }

  // GET /api/authors/:id
  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const author = await this.authorsService.getById(id);
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  // POST /api/authors
  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() authorData: CreateAuthorDTO) {
    return this.authorsService.create(authorData);
  }

  // PUT /api/authors/:id
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() authorData: UpdateAuthorDTO,
  ) {
    if (!(await this.authorsService.getById(id))) {
      throw new NotFoundException('Author not found');
    }
    await this.authorsService.updateById(id, authorData);
    return { success: true };
  }

  // DELETE /api/authors/:id
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.authorsService.getById(id))) {
      throw new NotFoundException('Author not found');
    }
    await this.authorsService.deleteById(id);
    return { success: true };
  }
}
