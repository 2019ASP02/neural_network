// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import JobDetails from './JobDetails';
import ScheduleMeeting from "./pages/ScheduleMeeting";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const handleLogin = (role) => {
        setIsAuthenticated(true);
        setUserRole(role);
        localStorage.setItem("role", role);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem("role");
    };

    const AuthRoute = ({ children, allowedRoles }) => {
        const storedRole = localStorage.getItem("role");

        if (storedRole && allowedRoles.includes(storedRole)) {
            return children;
        } else {
            return <Navigate to="/admin-login" replace />;
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/admin-login" replace />} />
                <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />
                <Route path="/job/:jobTitle" element={<JobDetails />} />
                <Route path="/admin/schedule-meeting" element={<ScheduleMeeting />} />
                <Route path="/admin" element={
                    <AuthRoute allowedRoles={["admin"]}>
                        <Admin onLogout={handleLogout} />
                    </AuthRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;