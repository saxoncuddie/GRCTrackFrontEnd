import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    let user = null;

    try {
        user = token ? jwtDecode(token) : null;
    } catch {
        localStorage.removeItem('token');
        user = null;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!user) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand" to="/dashboard">GRCTrack</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/compliance">Compliance</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/policies">Policies</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/grcevents">GRC Events</Link>
                    </li>
                    {user.role === 'admin' && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/audit">Audit</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/users">Users</Link>
                            </li>
                        </>
                    )}
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">About</Link>
                    </li>
                </ul>
                <span className="navbar-text me-3 text-light">
                    {user.username} ({user.role})
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
