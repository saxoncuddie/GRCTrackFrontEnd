import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch {
            localStorage.removeItem('token');
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="container mt-4">
            <h2>Welcome to GRCTrack, {user?.username}</h2>
            <p className="text-muted">Role: <strong>{user?.role}</strong></p>

            <hr />

            <div>
                <p>
                    <strong>GRCTrack</strong> is a secure Governance, Risk, and Compliance (GRC) tracking platform designed to help organizations manage:
                </p>
                <ul>
                    <li><strong>Compliance Logs:</strong> Document regulatory controls, status, and issues.</li>
                    <li><strong>Policy Library:</strong> Upload, view, and manage internal policy documents.</li>
                    <li><strong>GRC Events:</strong> Schedule and monitor GRC audit related tasks and milestones.</li>
                    <li><strong>Audit Logs:</strong> Maintain a record of user actions for internal security. (Admin only)</li>
                    <li><strong>User Management:</strong> Create and delete users as well as assign permissions.(Admin only)</li>
                </ul>
                <p>
                    You can use the navigation bar above to access the appropriate sections based on your role.
                </p>
                <p>
                    This application was developed as my <strong>Senior Capstone Project</strong> at Minot State University. I designed this to demonstrate full-stack development with cybersecurity integration, while trying to keep it as lightweight and user friendly as possible. Further details are avalible in the <strong> about</strong> page.
                </p>
            </div>
        </div>
    );
}

export default Dashboard;
