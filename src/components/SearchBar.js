import React, { useState, useEffect } from 'react';
import { multiSearch } from '../api';
import { Link } from 'react-router-dom';

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const fetchResults = async (searchQuery, page = 1) => {
        if (searchQuery.trim() === '') {
            setResults([]);
            setTotalResults(0);
            return;
        }
        const data = await multiSearch(searchQuery, page);
        if (page === 1) {
            setResults(data.results || []);
        } else {
            setResults(prevResults => [...prevResults, ...(data.results || [])]);
        }
        setTotalResults(data.total_results || 0);
        setCurrentPage(page);
    };

    const handleInputChange = e => {
        const value = e.target.value;
        setQuery(value);

        // Clear the previous timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set a new timeout to fetch results after a delay
        setTypingTimeout(
            setTimeout(() => {
                fetchResults(value, 1);
            }, 300) // Debounce delay of 300ms
        );
    };

    const loadMoreResults = () => {
        fetchResults(query, currentPage + 1);
    };

    return (
        <div className="search-page modern-search-page">
            {/* Search Bar */}
            <div className="search-bar modern-search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search for movies, TV shows, or people..."
                    className="modern-search-input"
                />
            </div>
            {/* Search Results */}
            <div className="search-results">
                {results.length > 0 ? (
                    <ul className="results-grid modern-grid">
                        {results.map(item => (
                            <li key={item.id} className="movie-card modern-card">
                                <div className="card-img-wrap">
                                    <img
                                        src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                                        alt={item.title || item.name}
                                        className="modern-img"
                                    />
                                    <span className="rating-badge">{item.vote_average}</span>
                                </div>
                                <div className="movie-info">
                                    <h3>{item.title || item.name}</h3>
                                    <div className="genre-chips">{item.genre_ids && item.genre_ids.map(id => <span key={id} className="genre-chip">{id}</span>)}</div>
                                    <span>{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</span>
                                </div>
                                <div className="movie-hover modern-hover">
                                    <Link to={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}><button>View Details</button></Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-results">
                        <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="No results" />
                        <p>No results found. Try a different search!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
