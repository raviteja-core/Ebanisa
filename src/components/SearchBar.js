import React, { useState, useEffect } from 'react';
import { multiSearch } from '../api';
import MediaCard from './MediaCard';

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => () => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
    }, [typingTimeout]);

    const fetchResults = async (searchQuery, page = 1) => {
        if (searchQuery.trim() === '') {
            setResults([]);
            setTotalResults(0);
            return;
        }
        const data = await multiSearch(searchQuery, page);
        const normalizedResults = (data.results || []).filter(item =>
            item.id && (item.media_type === 'movie' || item.media_type === 'tv')
        );
        if (page === 1) {
            setResults(normalizedResults);
        } else {
            setResults(prevResults => [...prevResults, ...normalizedResults]);
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
                    <>
                    <ul className="media-grid">
                        {results.map(item => (
                            <MediaCard
                                key={`${item.media_type}-${item.id}`}
                                item={item}
                                linkTo={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                            />
                        ))}
                    </ul>
                    {results.length < totalResults && (
                        <div className="floating-load-more">
                            <button onClick={loadMoreResults}>Load More Results</button>
                        </div>
                    )}
                    </>
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
