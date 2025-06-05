import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import './inventory.css';

function InventoryList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/v1/inventory/');
                setItems(response.data);
            } catch (err) {
                setError('Failed to fetch inventory.');
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="inventory-container">
            <h2>Inventory Items</h2>
            <button
                className="jowi-btn"
                style={{ marginBottom: 16 }}
                onClick={() => navigate('/createinventory')}
            >
                Create Inventory Item
            </button>
            {loading ? (
                <p>Loading...</p>
            ) : items.length > 0 ? (
                <ul className="inventory-list">
                    {items.map(item => (
                        <li
                            key={item.id}
                            style={{ cursor: 'pointer', position: 'relative' }}
                            onClick={() => navigate(`/inventory/${item.id}`)}
                        >
                            <strong>{item.name}</strong> ({item.unit_of_measure})<br />
                            <span className="desc">{item.description}</span>
                            <div className="meta">
                                Quantity: {item.quantity} <br />
                                Price: {item.price} <br />
                                Created: {item.c_at ? new Date(item.c_at).toLocaleString() : ''} <br />
                                Updated: {item.u_at ? new Date(item.u_at).toLocaleString() : ''}
                            </div>
                            <button
                                className="jowi-btn"
                                style={{ position: 'absolute', top: 8, right: 8 }}
                                onClick={e => {
                                    e.stopPropagation();
                                    navigate(`/inventory/${item.id}`);
                                }}
                            >
                                Detail
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No inventory items found.</p>
            )}
        </div>
    );
}

export default InventoryList;