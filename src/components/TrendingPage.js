import React, { useEffect, useState } from 'react';
import { fetchTrendingContent } from '../api';
import { Link } from 'react-router-dom';

function TrendingPage() {
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        fetchTrendingContent().then(data => setTrending(data.results || []));
    }, []);

    return (
        <div className="trending-page">
            <h1 className="page-title">🚀 Trending</h1>
            <p className="section-desc">Discover trending movies and TV shows here.</p>
            <ul className="movie-grid modern-grid">
                {trending.map(item => (
                    <li key={item.id} className="movie-card modern-card">
                        <div className="card-img-wrap">
                            <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.title || item.name} className="modern-img" />
                            <span className="rating-badge">{item.vote_average}</span>
                        </div>
                        <div className="movie-info">
                            <h3>{item.title || item.name}</h3>
                            <div className="genre-chips">
                                {item.genre_ids && item.genre_ids.map(id => <span key={id} className="genre-chip">{id}</span>)}
                            </div>
                        </div>
                        <div className="movie-hover modern-hover">
                            <Link to={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}><button>View Details</button></Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TrendingPage;
