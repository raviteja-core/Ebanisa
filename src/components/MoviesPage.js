import React, { useEffect, useMemo, useState } from 'react';
import { fetchMovieGenres, fetchPopularMovies } from '../api';
import MediaCard from './MediaCard';

const getDateValue = (value) => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMovieGenres().then((data) => setGenres(data.genres || []));
  }, []);

  useEffect(() => {
    fetchPopularMovies(currentPage).then((data) => {
      const nextItems = data.results || [];
      setMovies((prev) => {
        const merged = [...prev, ...nextItems];
        return merged.filter((item, index, arr) => index === arr.findIndex((x) => x.id === item.id));
      });
    });
  }, [currentPage]);

  const visibleMovies = useMemo(() => {
    let result = [...movies];

    if (selectedGenre) {
      const genreId = Number(selectedGenre);
      result = result.filter((movie) => movie.genre_ids?.includes(genreId));
    }

    if (sortOption === 'popularity') {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortOption === 'release_date') {
      result.sort((a, b) => getDateValue(b.release_date) - getDateValue(a.release_date));
    } else if (sortOption === 'rating') {
      result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortOption === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [movies, selectedGenre, sortOption]);

  return (
    <div className="movies-page">
      <h1 className="page-title">🎬 Movies</h1>
      <div className="sticky-filters filters">
        <select onChange={(e) => setSelectedGenre(e.target.value)} value={selectedGenre} className="filter-select">
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption} className="filter-select">
          <option value="">Sort By</option>
          <option value="popularity">Popularity</option>
          <option value="release_date">Release Date</option>
          <option value="rating">Rating</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>
      <ul className="media-grid">
        {visibleMovies.map((movie) => (
          <MediaCard key={movie.id} item={movie} linkTo={`/movie/${movie.id}`} />
        ))}
      </ul>
      <div className="floating-load-more">
        <button onClick={() => setCurrentPage((prev) => prev + 1)}>Load More</button>
      </div>
    </div>
  );
}

export default MoviesPage;
