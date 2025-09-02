import { IsUUID } from 'class-validator';

export class LikeBookDto {
  @IsUUID()
  bookId: string;

  @IsUUID()
  userId: string;
}
