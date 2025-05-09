// src/pages/PolicyLibrary.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function PolicyLibrary() {
    const [policies, setPolicies] = useState([]);
    const [file, setFile] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const fileInputRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');

        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
            fetchPolicies(token);
        } catch (err) {
            console.error('Invalid token');
            navigate('/');
        }
    }, [navigate]);

    const fetchPolicies = async (token) => {
        try {
            const res = await axios.get('http://localhost:3000/api/policies', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPolicies(res.data.reverse()); // show newest first
        } catch (err) {
            console.error('Failed to fetch policies:', err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:3000/api/policies/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFile(null);
            fileInputRef.current.value = null;
            fetchPolicies(token);
            alert('Upload successful');
        } catch (err) {
            console.error('Upload failed:', err.response?.data || err.message);
            alert('Upload failed');
        }
    };

    const handleDeletePolicy = async (id) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Are you sure you want to delete this policy?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/policies/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPolicies(token);
            alert('Policy deleted');
        } catch (err) {
            console.error('Deletion failed:', err);
            alert('Delete failed');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Policy Library</h3>

            {user?.role === 'admin' && (
                <form onSubmit={handleUpload} className="mb-4">
                    <div className="mb-2">
                        <input
                            type="file"
                            className="form-control"
                            ref={fileInputRef}
                            onChange={(e) => setFile(e.target.files[0])}
                            accept=".pdf,.docx,.txt"
                            required
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">Upload Policy</button>
                </form>
            )}

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Document</th>
                        <th>Uploaded</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.map((policy) => (
                        <tr key={policy.id}>
                            <td>{policy.originalname}</td>
                            <td>{new Date(policy.uploaded_at).toLocaleString()}</td>
                            <td>
                                <a
                                    href={`http://localhost:3000/api/policies/download/${policy.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-success me-2"
                                >
                                    Download
                                </a>
                                {policy.filename.endsWith('.pdf') && (
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => setSelectedPolicy(policy)}
                                    >
                                        View
                                    </button>
                                )}
                                {user?.role === 'admin' && (
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeletePolicy(policy.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedPolicy && (
                <div className="mt-4">
                    <h5>Previewing: {selectedPolicy.originalname}</h5>
                    <iframe
                        src={`http://localhost:3000/uploads/policies/${selectedPolicy.filename}`}
                        width="100%"
                        height="600px"
                        title="Policy Preview"
                        style={{ border: '1px solid #ccc' }}
                    ></iframe>
                    <button className="btn btn-secondary mt-2" onClick={() => setSelectedPolicy(null)}>
                        Close Preview
                    </button>
                </div>
            )}
        </div>
    );
}

export default PolicyLibrary;
