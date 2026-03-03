import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const getNavClass = ({ isActive }) => (isActive ? 'active' : '');

    return (
        <nav className="navbar compact-navbar">
            <div className="logo">
                <NavLink to="/">EBanisa</NavLink>
            </div>
            <div className={`menu${menuOpen ? ' open' : ''}`}>
                <NavLink to="/" end className={getNavClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
                <NavLink to="/movies" className={getNavClass} onClick={() => setMenuOpen(false)}>Movies</NavLink>
                <NavLink to="/tv" className={getNavClass} onClick={() => setMenuOpen(false)}>TV Shows</NavLink>
                <NavLink to="/genres" className={getNavClass} onClick={() => setMenuOpen(false)}>Genres</NavLink>
                <NavLink to="/trending" className={getNavClass} onClick={() => setMenuOpen(false)}>Trending</NavLink>
                <NavLink to="/search" className={getNavClass} onClick={() => setMenuOpen(false)}>Search</NavLink>
                <div className="avatar-placeholder">👤</div>
            </div>
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
}

export default Navbar;
