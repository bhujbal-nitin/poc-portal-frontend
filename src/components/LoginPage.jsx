import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5050/api/auth/login', credentials, {
                withCredentials: true // This is crucial for session-based auth
            });

            console.log('Login response:', response); // Add for debugging

            if (response.status === 200) {
                const { token, user } = response.data;

                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));

                onLogin(user);
            }
        } catch (error) {
            console.error('Full error details:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
                setError(error.response.data.message || 'Login failed');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Request details:', error.request);
                setError('Network error. Please check your connection and ensure the backend is running on port 5050.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                setError('An unexpected error occurred: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading || !credentials.username || !credentials.password}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;