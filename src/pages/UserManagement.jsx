import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');
        const decoded = jwtDecode(token);
        if (decoded.role !== 'admin') return navigate('/dashboard');
        fetchUsers(token);
    }, [navigate]);

    const fetchUsers = async (token) => {
        try {
            const res = await axios.get('grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/users', newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewUser({ username: '', password: '', role: 'user' });
            fetchUsers(token);
        } catch (err) {
            console.error('User creation failed:', err);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers(token);
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleRoleChange = async (id, role) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/users/${id}/role`, { role }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers(token);
        } catch (err) {
            console.error('Role update failed:', err);
        }
    };

    return (
        <div className="container mt-4">
            <h3>User Management</h3>
            <form onSubmit={handleCreateUser} className="mb-4">
                <div className="row g-2">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col">
                        <select
                            className="form-select"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="col">
                        <button type="submit" className="btn btn-success w-100">Create</button>
                    </div>
                </div>
            </form>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="form-select"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagement;
