// AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const AdminLogin = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in both fields.");
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);
            formData.append("role", "admin");

            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.detail || `HTTP error! status: ${response.status}`);
                return;
            }

            const result = await response.json();

            if (response.status === 200) {
                onLogin("admin");
                navigate("/admin"); // Correct navigation path
            } else {
                setError(result.detail || "Invalid username or password.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Server error. Try again later.");
        }
    };

  return (
    <div className="login-page">
      <div className="company-section">
        <img src="https://www.onedatasoftware.com/wp-content/uploads/2023/08/MicrosoftTeams-image-12-200x36.png" 
             alt="Company Logo" 
             className="company-logo" />
        <h1 className="company-name">One Data Software Solution</h1>
        <h3>Welcome<br />HR Management</h3>
      </div>

      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Admin Login Page</h2>

          <form onSubmit={handleLogin}>
            <input type="text" className="input-field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" className="input-field" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="forgot-password">
            <span>Forgot password?</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
