import React, { useEffect, useState } from 'react';
import { fetchTrendingContent, fetchPopularMovies, fetchPopularTVShows } from '../api';
import { Link } from 'react-router-dom';

function MovieList() {
    const [heroContent, setHeroContent] = useState(null);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [popularTVShows, setPopularTVShows] = useState([]);

    useEffect(() => {
        // Fetch hero content (first trending item)
        fetchTrendingContent().then(data => {
            if (data && Array.isArray(data.results) && data.results.length > 0) {
                setHeroContent(data.results[0]);
            } else {
                setHeroContent(null);
            }
        });

        // Fetch trending movies
        fetchTrendingContent().then(data => setTrendingMovies(data.results || []));

        // Fetch popular movies
        fetchPopularMovies().then(data => setPopularMovies(data.results || []));

        // Fetch popular TV shows
        fetchPopularTVShows().then(data => setPopularTVShows(data.results || []));
    }, []);

    return (
        <div className="movie-list-page">
            {/* Hero Section */}
            {heroContent && (
                <div className="hero" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${heroContent.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '80vh', position: 'relative', animation: 'fadeIn 1s' }}>
                    <div className="hero-overlay">
                        <h1>Discover Your Next Favorite Movie</h1>
                        <p>{heroContent.overview}</p>
                        <div className="cta-buttons">
                            <Link to={heroContent.media_type === 'movie' ? `/movie/${heroContent.id}` : `/tv/${heroContent.id}`}><button className="cta-button watch-now">▶ Play Trailer</button></Link>
                            <Link to={heroContent.media_type === 'movie' ? `/movie/${heroContent.id}` : `/tv/${heroContent.id}`}><button className="cta-button learn-more">Learn More</button></Link>
                        </div>
                    </div>
                </div>
            )}
            {/* Popular Movies */}
            <div className="section">
                <h2>🌟 Popular Movies</h2>
                <div className="carousel">
                    <button className="carousel-arrow left">&#8592;</button>
                    {popularMovies.map(movie => (
                        <div key={movie.id} className="carousel-item">
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                            <div className="carousel-overlay">
                                <p>{movie.title}</p>
                                <span className="rating-badge">{movie.vote_average}</span>
                                <div className="genre-tags">{movie.genre_ids && movie.genre_ids.map(id => <span key={id} className="genre-tag">{id}</span>)}</div>
                            </div>
                        </div>
                    ))}
                    <button className="carousel-arrow right">&#8594;</button>
                </div>
            </div>
            {/* Popular TV Shows */}
            <div className="section">
                <h2>📺 Popular TV Shows</h2>
                <div className="carousel">
                    <button className="carousel-arrow left">&#8592;</button>
                    {popularTVShows.map(show => (
                        <div key={show.id} className="carousel-item">
                            <img src={`https://image.tmdb.org/t/p/w200${show.poster_path}`} alt={show.name} />
                            <div className="carousel-overlay">
                                <p>{show.name}</p>
                                <span className="rating-badge">{show.vote_average}</span>
                                <div className="genre-tags">{show.genre_ids && show.genre_ids.map(id => <span key={id} className="genre-tag">{id}</span>)}</div>
                            </div>
                        </div>
                    ))}
                    <button className="carousel-arrow right">&#8594;</button>
                </div>
            </div>
            {/* Trending Now */}
            <div className="section">
                <h2>🔥 Trending Now</h2>
                <ul className="movie-grid modern-grid">
                    {trendingMovies.map(item => (
                        <li key={item.id} className="movie-card modern-card">
                            <div className="card-img-wrap">
                                <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.title || item.name} className="modern-img" />
                                <span className="rating-badge">{item.vote_average}</span>
                            </div>
                            <div className="movie-info">
                                <h3>{item.title || item.name}</h3>
                                <div className="genre-chips">{item.genre_ids && item.genre_ids.map(id => <span key={id} className="genre-chip">{id}</span>)}</div>
                            </div>
                            <div className="movie-hover modern-hover">
                                <Link to={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}><button>View Details</button></Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MovieList;

