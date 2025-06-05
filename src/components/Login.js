import React, { useState } from 'react';
import axios from '../api/axiosConfig';

function Login({ onLogin }) {
    const [mode, setMode] = useState('phone'); // 'phone' or 'pin'
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    // function getCookie(name) {
    //     let cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         const cookies = document.cookie.split(';');
    //         for (let i = 0; i < cookies.length; i++) {
    //             const cookie = cookies[i].trim();
    //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }


    const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
        // Use axios to POST to the JWT login endpoint
        const response = await axios.post('/api/v1/phone-jwt-login/', {
            phone_number: phone,
            password: password,
        });
        // Save JWT access token to localStorage
        localStorage.setItem('jwt', response.data.access);
        if (onLogin) onLogin();
    } catch (err) {
        if (err.response && err.response.data && err.response.data.detail) {
            setError('Phone login failed: ' + err.response.data.detail);
        } else {
            setError('Phone login failed. Please check your credentials.');
        }
    }
};

    const handlePinLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/v1/pin-login/', { pin });
            // Save JWT access token to localStorage
            localStorage.setItem('jwt', response.data.access);
            if (onLogin) onLogin();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError('PIN login failed: ' + err.response.data.detail);
            } else {
                setError('PIN login failed. Please check your PIN.');
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <div>
                <button onClick={() => setMode('phone')} disabled={mode === 'phone'}>Phone & Password</button>
                <button onClick={() => setMode('pin')} disabled={mode === 'pin'}>PIN</button>
            </div>
            {mode === 'phone' ? (
                <form onSubmit={handlePhoneLogin}>
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            ) : (
                <form onSubmit={handlePinLogin}>
                    <div>
                        <label>PIN:</label>
                        <input
                            type="password"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login with PIN</button>
                </form>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;