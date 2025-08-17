import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Movie } from './movie.entity';

@Entity('ratings')
@Unique(['userId', 'movie'])
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @ManyToOne(() => Movie, (movie) => movie.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
