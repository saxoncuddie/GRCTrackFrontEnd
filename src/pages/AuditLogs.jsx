import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');

        const decoded = jwtDecode(token);
        if (decoded.role !== 'admin') return navigate('/dashboard');

        fetchAuditLogs(token);
    }, [navigate]);

    const fetchAuditLogs = async (token) => {
        try {
            const res = await axios.get('http://localhost:3000/api/logs/audit', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLogs(res.data);
        } catch (err) {
            console.error('Failed to fetch audit logs:', err);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Audit Logs (Admin Only)</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>IP Address</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.username || 'N/A'}</td>
                            <td>{log.action}</td>
                            <td>{log.ip_address}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AuditLogs;
