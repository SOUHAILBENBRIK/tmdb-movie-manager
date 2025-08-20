import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1755713243944 implements MigrationInterface {
  name = 'Init1755713243944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`genres\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tmdbId\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_f011e0dcbc9df06a53c4917f59\` (\`tmdbId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ratings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL, \`rating\` decimal(2,1) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`movieId\` int NULL, UNIQUE INDEX \`IDX_116588721ee67dd5ad6c79a933\` (\`userId\`, \`movieId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`watchlists\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL, \`isFavorite\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`movieId\` int NULL, UNIQUE INDEX \`IDX_33bf70bd0c268cafaadf3ed70c\` (\`userId\`, \`movieId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tmdbId\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`overview\` text NULL, \`releaseDate\` varchar(255) NULL, \`voteAverage\` decimal(3,1) NULL, \`voteCount\` int NULL, \`posterPath\` varchar(255) NULL, \`backdropPath\` varchar(255) NULL, \`averageRating\` decimal(3,1) NOT NULL DEFAULT '0.0', \`ratingCount\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e9d4a90d2d6a56fd9f9300c937\` (\`tmdbId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movie_genres\` (\`movieId\` int NOT NULL, \`genreId\` int NOT NULL, INDEX \`IDX_b26290545d3bb905a70af25acd\` (\`movieId\`), INDEX \`IDX_d16b07e0cffb14d021d9b15b46\` (\`genreId\`), PRIMARY KEY (\`movieId\`, \`genreId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ratings\` ADD CONSTRAINT \`FK_c10d219b6360c74a9f2186b76df\` FOREIGN KEY (\`movieId\`) REFERENCES \`movies\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`watchlists\` ADD CONSTRAINT \`FK_7c42bdd7ae0b79b682270ab4089\` FOREIGN KEY (\`movieId\`) REFERENCES \`movies\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie_genres\` ADD CONSTRAINT \`FK_b26290545d3bb905a70af25acd0\` FOREIGN KEY (\`movieId\`) REFERENCES \`movies\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie_genres\` ADD CONSTRAINT \`FK_d16b07e0cffb14d021d9b15b468\` FOREIGN KEY (\`genreId\`) REFERENCES \`genres\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`movie_genres\` DROP FOREIGN KEY \`FK_d16b07e0cffb14d021d9b15b468\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie_genres\` DROP FOREIGN KEY \`FK_b26290545d3bb905a70af25acd0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`watchlists\` DROP FOREIGN KEY \`FK_7c42bdd7ae0b79b682270ab4089\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ratings\` DROP FOREIGN KEY \`FK_c10d219b6360c74a9f2186b76df\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d16b07e0cffb14d021d9b15b46\` ON \`movie_genres\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b26290545d3bb905a70af25acd\` ON \`movie_genres\``,
    );
    await queryRunner.query(`DROP TABLE \`movie_genres\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e9d4a90d2d6a56fd9f9300c937\` ON \`movies\``,
    );
    await queryRunner.query(`DROP TABLE \`movies\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_33bf70bd0c268cafaadf3ed70c\` ON \`watchlists\``,
    );
    await queryRunner.query(`DROP TABLE \`watchlists\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_116588721ee67dd5ad6c79a933\` ON \`ratings\``,
    );
    await queryRunner.query(`DROP TABLE \`ratings\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f011e0dcbc9df06a53c4917f59\` ON \`genres\``,
    );
    await queryRunner.query(`DROP TABLE \`genres\``);
  }
}
