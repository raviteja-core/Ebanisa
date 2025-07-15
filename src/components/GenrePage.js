import React, { useEffect, useState } from 'react';
import { fetchMovieGenres, fetchTVGenres, discoverMovies, discoverTVShows } from '../api';
import { Link } from 'react-router-dom';

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
        if (selectedGenre) {
            const fetchContent = contentType === 'movie' ? discoverMovies : discoverTVShows;
            fetchContent({ with_genres: selectedGenre.id, page: currentPage }).then(data =>
                setFilteredContent(prevContent => [...prevContent, ...(data.results || [])])
            );
        }
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

        const sortedContent = [...filteredContent]; // Create a new array to avoid mutating state directly
        if (sortValue === 'popularity') {
            sortedContent.sort((a, b) => b.popularity - a.popularity);
        } else if (sortValue === 'release_date') {
            sortedContent.sort((a, b) => new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date));
        }

        setFilteredContent(sortedContent); // Update state with the sorted array
    };

    const loadMoreContent = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (
        <div className="genre-page">
            <div className="section">
                <h1 className="page-title">🎭 Explore by Genre</h1>
                <p className="section-desc">Browse through a variety of genres to find your next favorite movie or TV show.</p>
            </div>
            <div className="sticky-filters filters">
                <select onChange={handleSortChange} value={sortOption} className="filter-select">
                    <option value="">Sort By</option>
                    <option value="popularity">Popularity</option>
                    <option value="release_date">Release/Air Date</option>
                </select>
            </div>
            <ul className="movie-grid modern-grid">
                {filteredContent.map(item => (
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
                            <p className="release-year">{new Date(item.release_date || item.first_air_date).getFullYear()}</p>
                        </div>
                        <div className="movie-hover modern-hover">
                            <p>{item.overview.slice(0, 100)}...</p>
                            <Link to={contentType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}><button>View Details</button></Link>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button onClick={loadMoreContent}>Load More</button>
            </div>
        </div>
    );
}

export default GenrePage;
