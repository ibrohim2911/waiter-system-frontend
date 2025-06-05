import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import './inventory.css';

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [name, setName] = useState('');
    const [table, setTable] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/v1/reservations/');
                setReservations(response.data);
            } catch (err) {
                setError('Failed to fetch reservations.');
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []);

    const handleReservation = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('/api/v1/reservations/', {
                name,
                table,
                date,
            });
            setSuccess('Reservation created!');
            setName('');
            setTable('');
            setDate('');
            setReservations(prev => [...prev, response.data]);
        } catch (err) {
            setError('Failed to create reservation.');
        }
    };

    return (
        <div className="inventory-container">
            <h2>Reservations</h2>
            <form className="order-form" onSubmit={handleReservation}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Table (ID or Name):</label>
                    <input
                        type="text"
                        value={table}
                        onChange={e => setTable(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Date & Time:</label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Reservation</button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '1em' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '1em' }}>{success}</p>}
            <h3>Reservation List</h3>
            {loading ? (
                <p>Loading...</p>
            ) : reservations.length > 0 ? (
                <ul className="inventory-list">
                    {reservations.map(res => (
                        <li key={res.id}>
                            <strong>{res.name}</strong> | 
                            Table: {res.table_details ? res.table_details.name : res.table} | 
                            Date: {res.date ? new Date(res.date).toLocaleString() : ''} | 
                            Status: {res.status || 'N/A'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reservations found.</p>
            )}
        </div>
    );
}

export default Reservations;