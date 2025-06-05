import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import './inventory.css';

function TableList() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/v1/tables/');
                setTables(response.data);
            } catch (err) {
                setError('Failed to fetch tables.');
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="inventory-container">
            <h2>Tables</h2>
            {loading ? (
                <p>Loading...</p>
            ) : tables.length > 0 ? (
                <ul className="inventory-list">
                    {tables.map(table => (
                        <li key={table.id}>
                            <strong>{table.name}</strong> (ID: {table.id})<br />
                            Location: {table.location} <br />
                            Capacity: {table.capacity} <br />
                            Available: {table.is_available ? 'Yes' : 'No'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tables found.</p>
            )}
        </div>
    );
}

export default TableList;