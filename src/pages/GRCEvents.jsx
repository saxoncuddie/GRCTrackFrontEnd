import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function GRCEvents() {
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', scheduled_date: '' });
    const [editId, setEditId] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
            fetchEvents(token);
        } catch {
            localStorage.removeItem('token');
            navigate('/');
        }
    }, [navigate]);

    const fetchEvents = async (token) => {
        try {
            const res = await axios.get('grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/grcevents', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(res.data);
        } catch (err) {
            console.error('Failed to load events:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editId) {
                await axios.put(`grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/grcevents/${editId}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post('grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/grcevents', form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setForm({ title: '', description: '', scheduled_date: '' });
            setEditId(null);
            fetchEvents(token);
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/grcevents/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents(token);
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const startEdit = (event) => {
        setEditId(event.id);
        setForm({
            title: event.title,
            description: event.description,
            scheduled_date: event.scheduled_date.split('T')[0]
        });
    };

    return (
        <div className="container mt-4">
            <h3>GRC Events</h3>

            <form onSubmit={handleSubmit} className="row g-2 mb-4">
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        value={form.scheduled_date}
                        onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary w-100" type="submit">
                        {editId ? 'Update' : 'Schedule'}
                    </button>
                </div>
            </form>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((ev) => (
                        <tr key={ev.id}>
                            <td>{ev.title}</td>
                            <td>{ev.description}</td>
                            <td>{new Date(ev.scheduled_date).toLocaleDateString()}</td>
                            <td>{ev.status}</td>
                            <td>{ev.notes}</td>
                            <td>
                                {(user?.id === ev.user_id || user?.role === 'admin') && (
                                    <>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(ev)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ev.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GRCEvents;
