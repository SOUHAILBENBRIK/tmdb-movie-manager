import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movie } from './movie.entity';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tmdbId: number;

  @Column()
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
