import React, { useEffect, useState } from 'react';
import { fetchTrendingContent } from '../api';
import MediaCard from './MediaCard';

function TrendingPage() {
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        fetchTrendingContent().then(data => setTrending(data.results || []));
    }, []);

    return (
        <div className="trending-page">
            <h1 className="page-title">🚀 Trending</h1>
            <p className="section-desc">Discover trending movies and TV shows here.</p>
            <ul className="media-grid">
                {trending.map(item => (
                    <MediaCard
                        key={item.id}
                        item={item}
                        linkTo={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                    />
                ))}
            </ul>
        </div>
    );
}

export default TrendingPage;
