""// src/pages/ComplianceLogs.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function ComplianceLogs() {
    const [logs, setLogs] = useState([]);
    const [form, setForm] = useState({ regulation: '', status: '', notes: '' });
    const [editingId, setEditingId] = useState(null);
    const [editingForm, setEditingForm] = useState({ regulation: '', status: '', notes: '' });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                fetchLogs(token);
            } catch {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const fetchLogs = async (token) => {
        try {
            const res = await axios.get('grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/logs/compliance', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLogs(res.data);
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/logs/compliance', form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setForm({ regulation: '', status: '', notes: '' });
            fetchLogs(token);
        } catch (err) {
            console.error('Create failed:', err);
        }
    };

    const startEditing = (log) => {
        setEditingId(log.id);
        setEditingForm({
            regulation: log.regulation,
            status: log.status,
            notes: log.notes || ''
        });
    };

    const handleEditSave = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/logs/compliance/${id}`, editingForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditingId(null);
            fetchLogs(token);
        } catch (err) {
            console.error('Edit failed:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this log?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/logs/compliance/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchLogs(token);
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleExportCSV = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/logs/compliance/export/csv', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to export CSV');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'compliance_logs.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('CSV export failed:', err);
            alert('CSV export failed');
        }
    };

    const handleExportPDF = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('grctrackbackend-e2b8aed8dhhmeudj.centralus-01.azurewebsites.net/api/logs/compliance/export/pdf', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to export PDF');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'compliance_logs.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('PDF export failed:', err);
            alert('PDF export failed');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Compliance Logs</h3>

            <div className="mb-3">
                <button onClick={handleExportCSV} className="btn btn-outline-secondary me-2">Export CSV</button>
                <button onClick={handleExportPDF} className="btn btn-outline-secondary">Export PDF</button>
            </div>

            <form onSubmit={handleSubmit} className="row g-2 mb-4">
                <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Regulation" value={form.regulation} onChange={(e) => setForm({ ...form, regulation: e.target.value })} required />
                </div>
                <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required />
                </div>
                <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Add Log</button>
                </div>
            </form>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Regulation</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id}>
                            <td>{log.username}</td>
                            <td>{editingId === log.id ? (
                                <input type="text" className="form-control" value={editingForm.regulation} onChange={(e) => setEditingForm({ ...editingForm, regulation: e.target.value })} />
                            ) : log.regulation}</td>
                            <td>{editingId === log.id ? (
                                <input type="text" className="form-control" value={editingForm.status} onChange={(e) => setEditingForm({ ...editingForm, status: e.target.value })} />
                            ) : log.status}</td>
                            <td>{editingId === log.id ? (
                                <input type="text" className="form-control" value={editingForm.notes} onChange={(e) => setEditingForm({ ...editingForm, notes: e.target.value })} />
                            ) : log.notes}</td>
                            <td>{new Date(log.created_at).toLocaleString()}</td>
                            <td>
                                {(user?.id === log.user_id || user?.role === 'admin') && (
                                    editingId === log.id ? (
                                        <>
                                            <button className="btn btn-sm btn-success me-2" onClick={() => handleEditSave(log.id)}>Save</button>
                                            <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-sm btn-warning me-2" onClick={() => startEditing(log)}>Edit</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(log.id)}>Delete</button>
                                        </>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ComplianceLogs;
