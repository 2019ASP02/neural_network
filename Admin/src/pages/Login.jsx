import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ username, password, role })
      });

      if (response.ok) {
        onLogin(role); // Set user role in App.js
        navigate(role === "admin" ? "/currentjobvacancies" : "/user"); // Redirect based on role
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Login failed. Try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="company-section">
        <img src="https://www.onedatasoftware.com/wp-content/uploads/2023/08/MicrosoftTeams-image-12-200x36.png" alt="Company Logo" className="company-logo" />
        <h1 className="company-name">One Data Software Solution</h1>
        <h2>Welcome</h2>
      </div>

      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login Here</h2>

          <div className="role-selection">
            <label>Select Role</label>
            <div className="role-buttons">
              <button className={`role-btn ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>Admin</button>
              <button className={`role-btn ${role === 'user' ? 'active' : ''}`} onClick={() => setRole('user')}>User</button>
            </div>
          </div>

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

export default Login;
