import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Genre } from './genre.entity';
import { Rating } from './rating.entity';
import { Watchlist } from './watchlist.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tmdbId: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ nullable: true })
  releaseDate: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  voteAverage: number;

  @Column({ nullable: true })
  voteCount: number;

  @Column({ nullable: true })
  posterPath: string;

  @Column({ nullable: true })
  backdropPath: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  ratingCount: number;

  @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: true })
  @JoinTable({
    name: 'movie_genres',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genreId', referencedColumnName: 'id' },
  })
  genres: Genre[];

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];

  @OneToMany(() => Watchlist, (watchlist) => watchlist.movie)
  watchlists: Watchlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
