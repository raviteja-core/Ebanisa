import React, { useEffect, useMemo, useState } from 'react';
import { fetchMovieGenres, fetchTVGenres, discoverMovies, discoverTVShows } from '../api';
import MediaCard from './MediaCard';

const getDateValue = (item) => {
    const value = item.release_date || item.first_air_date;
    if (!value) return 0;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

function GenrePage() {
    const [movieGenres, setMovieGenres] = useState([]);
    const [tvGenres, setTVGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [contentType, setContentType] = useState('movie'); // 'movie' or 'tv'
    const [filteredContent, setFilteredContent] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Fetch genres for movies and TV shows
        fetchMovieGenres().then(data => setMovieGenres(data.genres || []));
        fetchTVGenres().then(data => setTVGenres(data.genres || []));
    }, []);

    useEffect(() => {
        if (!selectedGenre) return;
        let cancelled = false;

        const fetchContent = contentType === 'movie' ? discoverMovies : discoverTVShows;
        fetchContent({ with_genres: selectedGenre.id, page: currentPage }).then(data =>
            {
                if (cancelled) return;
                setFilteredContent(prevContent => {
                    const merged = [...prevContent, ...(data.results || [])];
                    return merged
                      .filter((item, index, arr) => index === arr.findIndex((x) => x.id === item.id));
                });
            }
        );

        return () => {
            cancelled = true;
        };
    }, [selectedGenre, contentType, currentPage]);

    const handleGenreClick = (genre, type) => {
        setSelectedGenre(genre);
        setContentType(type);
        setFilteredContent([]);
        setCurrentPage(1);
    };

    const handleSortChange = e => {
        const sortValue = e.target.value;
        setSortOption(sortValue);
    };

    const loadMoreContent = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const activeGenres = contentType === 'movie' ? movieGenres : tvGenres;
    const displayedContent = useMemo(() => {
        const sorted = [...filteredContent];
        if (sortOption === 'popularity') {
            sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        } else if (sortOption === 'release_date') {
            sorted.sort((a, b) => getDateValue(b) - getDateValue(a));
        } else if (sortOption === 'rating') {
            sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        } else if (sortOption === 'title') {
            sorted.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
        }
        return sorted;
    }, [filteredContent, sortOption]);

    return (
        <div className="genre-page">
            <div className="section">
                <h1 className="page-title">🎭 Explore by Genre</h1>
                <p className="section-desc">Browse through a variety of genres to find your next favorite movie or TV show.</p>
            </div>
            <div className="section">
                <div className="filters">
                    <button
                        className={contentType === 'movie' ? 'active-toggle' : ''}
                        onClick={() => {
                            setContentType('movie');
                            setSelectedGenre(null);
                            setFilteredContent([]);
                            setCurrentPage(1);
                        }}
                    >
                        Movies
                    </button>
                    <button
                        className={contentType === 'tv' ? 'active-toggle' : ''}
                        onClick={() => {
                            setContentType('tv');
                            setSelectedGenre(null);
                            setFilteredContent([]);
                            setCurrentPage(1);
                        }}
                    >
                        TV Shows
                    </button>
                </div>
                <div className="genre-chips" style={{ marginTop: '16px' }}>
                    {activeGenres.map((genre) => (
                        <button
                            key={`${contentType}-${genre.id}`}
                            className={selectedGenre?.id === genre.id ? 'active-toggle' : ''}
                            onClick={() => handleGenreClick(genre, contentType)}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="sticky-filters filters">
                <select onChange={handleSortChange} value={sortOption} className="filter-select">
                    <option value="">Sort By</option>
                    <option value="popularity">Popularity</option>
                    <option value="release_date">Release/Air Date</option>
                    <option value="rating">Rating</option>
                    <option value="title">Title (A-Z)</option>
                </select>
            </div>
            {!selectedGenre && (
                <p className="section-desc">Select a genre to see content.</p>
            )}
            <ul className="media-grid">
                {displayedContent.map(item => (
                    <MediaCard
                        key={item.id}
                        item={item}
                        linkTo={contentType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                    />
                    ))}
            </ul>
            {selectedGenre && filteredContent.length > 0 && (
                <div className="pagination">
                    <button onClick={loadMoreContent}>Load More</button>
                </div>
            )}
        </div>
    );
}

export default GenrePage;
