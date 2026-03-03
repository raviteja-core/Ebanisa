import React, { useEffect, useMemo, useState } from 'react';
import { fetchPopularTVShows, fetchTVGenres } from '../api';
import MediaCard from './MediaCard';

const getDateValue = (value) => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

function TVShowsPage() {
  const [tvShows, setTVShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTVGenres().then((data) => setGenres(data.genres || []));
  }, []);

  useEffect(() => {
    fetchPopularTVShows(currentPage).then((data) => {
      const nextItems = data.results || [];
      setTVShows((prev) => {
        const merged = [...prev, ...nextItems];
        return merged.filter((item, index, arr) => index === arr.findIndex((x) => x.id === item.id));
      });
    });
  }, [currentPage]);

  const visibleTVShows = useMemo(() => {
    let result = [...tvShows];

    if (selectedGenre) {
      const genreId = Number(selectedGenre);
      result = result.filter((show) => show.genre_ids?.includes(genreId));
    }

    if (sortOption === 'popularity') {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortOption === 'first_air_date') {
      result.sort((a, b) => getDateValue(b.first_air_date) - getDateValue(a.first_air_date));
    } else if (sortOption === 'rating') {
      result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortOption === 'title') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [tvShows, selectedGenre, sortOption]);

  return (
    <div className="tvshows-page">
      <h1 className="page-title">📺 TV Shows</h1>
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
          <option value="first_air_date">First Air Date</option>
          <option value="rating">Rating</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>
      <ul className="media-grid">
        {visibleTVShows.map((tvShow) => (
          <MediaCard key={tvShow.id} item={tvShow} linkTo={`/tv/${tvShow.id}`} />
        ))}
      </ul>
      <div className="floating-load-more">
        <button onClick={() => setCurrentPage((prev) => prev + 1)}>Load More</button>
      </div>
    </div>
  );
}

export default TVShowsPage;
