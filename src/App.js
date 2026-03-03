import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import SearchBar from './components/SearchBar';
import TVShowDetail from './components/TVShowDetail';
import MoviesPage from './components/MoviesPage';
import TrendingPage from './components/TrendingPage';
import TVShowsPage from './components/TVShowsPage';
import GenrePage from './components/GenrePage';
import { usePageTransition, useScrollProgressBar } from './hooks/usePageTransition';
import { useGlobalScrollEffects } from './hooks/useGlobalScrollEffects';
import CinematicIntroLoader from './components/CinematicIntroLoader';

function AppShell() {
    usePageTransition();
    useScrollProgressBar();
    useGlobalScrollEffects();

    return (
        <div className="app-container">
            <Navbar />
            <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/tv" element={<TVShowsPage />} />
                <Route path="/tv/:id" element={<TVShowDetail />} />
                <Route path="/genres" element={<GenrePage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/search" element={<SearchBar />} />
            </Routes>
            <footer className="footer">
                <p>"As long as I live, there are infinite chances!"</p>
            </footer>
        </div>
    );
}

function AppBootstrap() {
    const [showIntro, setShowIntro] = useState(true);
    const navigate = useNavigate();

    const handleIntroComplete = useCallback(() => {
        setShowIntro(false);
        navigate('/', { replace: true });
    }, [navigate]);

    if (showIntro) {
        return <CinematicIntroLoader onComplete={handleIntroComplete} />;
    }

    return <AppShell />;
}

function App() {
    return (
        <Router>
            <AppBootstrap />
        </Router>
    );
}

export default App;
