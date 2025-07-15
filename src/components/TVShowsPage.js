import React, { useEffect, useState } from 'react';
import { fetchPopularTVShows } from '../api';
import { Link } from 'react-router-dom';

function TVShowsPage() {
    const [tvShows, setTVShows] = useState([]);
    const [filteredTVShows, setFilteredTVShows] = useState([]);
    const [genres, setGenres] = useState([
        { id: 10759, name: 'Action & Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Family' },
        { id: 10765, name: 'Sci-Fi & Fantasy' },
    ]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchPopularTVShows(currentPage).then(data => {
            setTVShows(prevTVShows => [...prevTVShows, ...(data.results || [])]);
        });
    }, [currentPage]);

    useEffect(() => {
        let filtered = [...tvShows];

        // Filter by genre
        if (selectedGenre) {
            filtered = filtered.filter(tvShow => tvShow.genre_ids.includes(parseInt(selectedGenre)));
        }

        // Sort TV shows
        if (sortOption === 'popularity') {
            filtered.sort((a, b) => b.popularity - a.popularity);
        } else if (sortOption === 'first_air_date') {
            filtered.sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));
        }

        setFilteredTVShows(filtered); // Update state with the filtered and sorted array
    }, [tvShows, selectedGenre, sortOption]);

    const loadMoreTVShows = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (
        <div className="tvshows-page">
            <h1 className="page-title">📺 TV Shows</h1>
            <div className="sticky-filters filters">
                <select onChange={e => setSelectedGenre(e.target.value)} value={selectedGenre} className="filter-select">
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                </select>
                <select onChange={e => setSortOption(e.target.value)} value={sortOption} className="filter-select">
                    <option value="">Sort By</option>
                    <option value="popularity">Popularity</option>
                    <option value="first_air_date">First Air Date</option>
                </select>
            </div>
            <ul className="movie-grid modern-grid">
                {filteredTVShows.map(tvShow => (
                    <li key={tvShow.id} className="movie-card modern-card">
                        <div className="card-img-wrap">
                            <img src={`https://image.tmdb.org/t/p/w300${tvShow.poster_path}`} alt={tvShow.name} className="modern-img" />
                            <span className="rating-badge">{tvShow.vote_average}</span>
                        </div>
                        <div className="movie-info">
                            <h3>{tvShow.name}</h3>
                            <div className="genre-chips">
                                {tvShow.genre_ids && tvShow.genre_ids.map(id => <span key={id} className="genre-chip">{id}</span>)}
                            </div>
                            <p className="release-year">{new Date(tvShow.first_air_date).getFullYear()}</p>
                        </div>
                        <div className="movie-hover modern-hover">
                            <p>{tvShow.overview.slice(0, 100)}...</p>
                            <Link to={`/tv/${tvShow.id}`}><button>View Details</button></Link>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="floating-load-more">
                <button onClick={loadMoreTVShows}>Load More</button>
            </div>
        </div>
    );
}

export default TVShowsPage;
