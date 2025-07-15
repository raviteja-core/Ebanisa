import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="navbar compact-navbar">
            <div className="logo">
                <NavLink to="/">EBanisa</NavLink>
            </div>
            <div className={`menu${menuOpen ? ' open' : ''}`}>
                <NavLink to="/" end activeClassName="active" onClick={() => setMenuOpen(false)}>Home</NavLink>
                <NavLink to="/movies" activeClassName="active" onClick={() => setMenuOpen(false)}>Movies</NavLink>
                <NavLink to="/tv" activeClassName="active" onClick={() => setMenuOpen(false)}>TV Shows</NavLink>
                <NavLink to="/genres" activeClassName="active" onClick={() => setMenuOpen(false)}>Genres</NavLink>
                <NavLink to="/trending" activeClassName="active" onClick={() => setMenuOpen(false)}>Trending</NavLink>
                <NavLink to="/search" activeClassName="active" onClick={() => setMenuOpen(false)}>Search</NavLink>
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
