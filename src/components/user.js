import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import './inventory.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/v1/users/');
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="inventory-container">
            <h2>Users</h2>
            {loading ? (
                <p>Loading...</p>
            ) : users.length > 0 ? (
                <ul className="inventory-list">
                    {users.map(user => (
                        <li key={user.id}>
                            <strong>{user.username || user.phone_number || user.email}</strong> (ID: {user.id})<br />
                            Name: {user.first_name} {user.last_name} <br />
                            Email: {user.email} <br />
                            Phone: {user.phone_number || 'N/A'} <br />
                            Is Staff: {user.is_staff ? 'Yes' : 'No'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
}

export default Users;