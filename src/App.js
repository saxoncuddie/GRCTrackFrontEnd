// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ComplianceLogs from './pages/ComplianceLogs';
import AuditLogs from './pages/AuditLogs';
import PolicyLibrary from './pages/PolicyLibrary';
import UserManagement from './pages/UserManagement';
import GRCEvents from './pages/GRCEvents';
import About from './pages/About';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/compliance"
                    element={
                        <PrivateRoute>
                            <ComplianceLogs />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/grcevents"
                    element={
                        <PrivateRoute>
                            <GRCEvents />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/policies"
                    element={
                        <PrivateRoute>
                            <PolicyLibrary />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/audit"
                    element={
                        <PrivateRoute role="admin">
                            <AuditLogs />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <PrivateRoute role="admin">
                            <UserManagement />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <PrivateRoute>
                            <About />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
