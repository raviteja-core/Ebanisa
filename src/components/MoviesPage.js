import React, { useEffect, useState } from 'react';
import { fetchPopularMovies } from '../api';
import { Link } from 'react-router-dom';

function MoviesPage() {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [genres, setGenres] = useState([
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
        { id: 18, name: 'Drama' },
        { id: 878, name: 'Sci-Fi' },
        { id: 27, name: 'Horror' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 14, name: 'Fantasy' },
        { id: 53, name: 'Thriller' },
    ]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchPopularMovies(currentPage).then(data => {
            setMovies(prevMovies => [...prevMovies, ...(data.results || [])]);
        });
    }, [currentPage]);

    useEffect(() => {
        let filtered = [...movies];

        // Filter by genre
        if (selectedGenre) {
            filtered = filtered.filter(movie => movie.genre_ids.includes(parseInt(selectedGenre)));
        }

        // Sort movies
        if (sortOption === 'popularity') {
            filtered.sort((a, b) => b.popularity - a.popularity);
        } else if (sortOption === 'release_date') {
            filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        }

        setFilteredMovies(filtered); // Update state with the filtered and sorted array
    }, [movies, selectedGenre, sortOption]);

    const loadMoreMovies = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (
        <div className="movies-page">
            <h1 className="page-title">🎬 Movies</h1>
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
                    <option value="release_date">Release Date</option>
                </select>
            </div>
            <ul className="movie-grid modern-grid">
                {filteredMovies.map(movie => (
                    <li key={movie.id} className="movie-card modern-card">
                        <div className="card-img-wrap">
                            <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="modern-img" />
                            <span className="rating-badge">{movie.vote_average}</span>
                        </div>
                        <div className="movie-info">
                            <h3>{movie.title}</h3>
                            <div className="genre-chips">
                                {movie.genre_ids && movie.genre_ids.map(id => <span key={id} className="genre-chip">{id}</span>)}
                            </div>
                            <p className="release-year">{new Date(movie.release_date).getFullYear()}</p>
                        </div>
                        <div className="movie-hover modern-hover">
                            <p>{movie.overview.slice(0, 100)}...</p>
                            <Link to={`/movie/${movie.id}`}><button>View Details</button></Link>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="floating-load-more">
                <button onClick={loadMoreMovies}>Load More</button>
            </div>
        </div>
    );
}

export default MoviesPage;
