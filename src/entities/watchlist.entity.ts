import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Movie } from './movie.entity';

@Entity('watchlists')
@Unique(['userId', 'movie'])
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ default: false })
  isFavorite: boolean;

  @ManyToOne(() => Movie, (movie) => movie.watchlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @CreateDateColumn()
  createdAt: Date;
}
