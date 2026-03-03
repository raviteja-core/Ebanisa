import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTrendingContent, fetchPopularMovies, fetchPopularTVShows } from '../api';
import { hasCardImage } from '../utils/images';
import MediaCard from './MediaCard';

function MovieList() {
  const [heroContent, setHeroContent] = useState(null);
  const [trendingItems, setTrendingItems] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      const [trendingResponse, moviesResponse, tvResponse] = await Promise.all([
        fetchTrendingContent(),
        fetchPopularMovies(),
        fetchPopularTVShows(),
      ]);

      if (!isMounted) return;

      const trending = trendingResponse?.results || [];
      setHeroContent(trending.find(hasCardImage) || null);
      setTrendingItems(trending.slice(0, 12));
      setPopularMovies((moviesResponse?.results || []).slice(0, 12));
      setPopularTVShows((tvResponse?.results || []).slice(0, 12));
    };

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="movie-list-page">
      {heroContent && (
        <div
          className="hero"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroContent.backdrop_path})`,
          }}
        >
          <div className="hero-overlay">
            <h1>Discover Your Next Favorite Movie</h1>
            <p>{heroContent.overview}</p>
            <div className="cta-buttons">
              <Link to={heroContent.media_type === 'tv' ? `/tv/${heroContent.id}` : `/movie/${heroContent.id}`}>
                <button className="cta-button watch-now">View Details</button>
              </Link>
              <Link to="/trending">
                <button className="cta-button learn-more">Browse Trending</button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="section">
        <h2>Popular Movies</h2>
        <ul className="media-grid">
          {popularMovies.map((movie) => (
            <MediaCard key={movie.id} item={movie} linkTo={`/movie/${movie.id}`} />
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Popular TV Shows</h2>
        <ul className="media-grid">
          {popularTVShows.map((show) => (
            <MediaCard key={show.id} item={show} linkTo={`/tv/${show.id}`} />
          ))}
        </ul>
      </div>

      <div className="section trending-section">
        <h2>Trending Now</h2>
        <ul className="media-grid">
          {trendingItems.map((item) => (
            <MediaCard
              key={`${item.media_type || 'movie'}-${item.id}`}
              item={item}
              linkTo={item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MovieList;
