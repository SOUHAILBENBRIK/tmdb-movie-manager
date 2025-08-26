# 🎬 TMDB CRUD API (NestJS + MySQL + Redis)

A scalable CRUD application built with **NestJS** that integrates with [The Movie Database (TMDB)](https://www.themoviedb.org/) APIs.  
The app syncs movies and genres into a relational database, provides a REST API for CRUD operations, and implements caching for performance.  

---

## ✨ Features
- **Movies**
  - CRUD endpoints
  - Search, filtering, sorting, pagination
  - Sync popular movies from TMDB
  - Rate movies (with average rating calculation)
  - Add/remove movies from a personal watchlist

- **Genres**
  - CRUD endpoints
  - Sync genres from TMDB
  - Filter movies by genre

- **TMDB Integration**
  - Initial sync of genres & popular movies on bootstrap
  - Manual sync endpoints
  - Search TMDB directly via API

- **Caching**
  - Redis caching for movies & genres queries

- **Documentation**
  - Swagger API documentation available at `/api` (when app is running)

---

## 🛠 Tech Stack
- **Backend**: [NestJS](https://nestjs.com/) + TypeORM  
- **Database**: MySQL 8 (via Docker)  
- **Cache**: Redis 7 (via Docker)  
- **Deployment**: Docker & Docker Compose  
- **Testing**: Jest (unit tests)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/SOUHAILBENBRIK/tmdb-movie-manager.git
cd tmdb-movie-manager
```

### 2. Environment Variables
Create a `.env` file in the root:
```env
TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Run with Docker
```bash
docker-compose up --build
```

The app will be available at:  
👉 `http://localhost:8080/api`

Swagger docs:  
👉 `http://localhost:8080/api-docs`

---

## 📂 Project Structure
```
src/
  entities/         # Database entities (Movie, Genre, Rating, Watchlist)
  movies/           # Movies module (controller, service, DTOs)
  genres/           # Genres module
  tmdb/             # TMDB sync + integration
```

---

## 📖 API Highlights

### Movies
- `POST /movies` → Create movie  
- `GET /movies` → List movies (supports `search`, `genreIds`, `page`, `limit`, `sortBy`, `sortOrder`)  
- `GET /movies/:id` → Get movie by ID  
- `PATCH /movies/:id` → Update movie  
- `DELETE /movies/:id` → Delete movie  
- `POST /movies/rate` → Rate a movie  
- `POST /movies/watchlist` → Add to watchlist  
- `DELETE /movies/:id/watchlist/:userId` → Remove from watchlist  

### Genres
- `POST /genres` → Create genre  
- `GET /genres` → List genres  
- `GET /genres/:id` → Get genre  
- `PATCH /genres/:id` → Update genre  
- `DELETE /genres/:id` → Delete genre  

### TMDB
- `POST /tmdb/sync/genres` → Sync genres from TMDB  
- `POST /tmdb/sync/popular-movies?pages=5` → Sync N pages of popular movies  
- `GET /tmdb/search?q=query` → Search TMDB movies  
- `GET /tmdb/movie/:tmdbId` → Get TMDB movie details  

---

## 🧪 Testing
Run tests with:
```bash
npm run test
```

(Goal: ≥85% coverage)



## 📌 Best Practices Followed
- Clean architecture (NestJS modules, services, controllers, DTOs)
- SOLID principles
- Caching (Redis)
- Production-ready Docker setup
- Swagger API docs
- Unit tests included

