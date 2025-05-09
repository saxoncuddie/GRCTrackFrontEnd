import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ children, role }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/" replace />;

    try {
        const user = jwtDecode(token);
        if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
        return children;
    } catch {
        localStorage.removeItem('token');
        return <Navigate to="/" replace />;
    }
}

export default PrivateRoute;
