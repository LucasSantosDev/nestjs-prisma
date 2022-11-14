import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { BookDTO } from './book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async create(data: Exclude<BookDTO, { id: string }>) {
    const bookExists = await this.prisma.book.findFirst({
      where: {
        bar_code: data.bar_code,
      },
    });

    if (bookExists) {
      throw new Error('Book already exists');
    }

    delete data.id;

    const book = await this.prisma.book.create({
      data,
    });

    return book;
  }

  async findAll() {
    return this.prisma.book.findMany();
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findFirst({
      where: {
        id: String(id),
      },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    return book;
  }

  async update(id: string, data: Exclude<BookDTO, { id: string }>) {
    const bookExists = await this.prisma.book.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!bookExists) {
      throw new Error('Book does not exists');
    }

    delete data.id;

    return await this.prisma.book.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: string) {
    const book = await this.prisma.book.findFirst({
      where: {
        id: String(id),
      },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    return await this.prisma.book.delete({
      where: {
        id: String(id),
      },
    });
  }
}
