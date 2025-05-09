import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/auth/login', {
                username,
                password,
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials or server error');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
