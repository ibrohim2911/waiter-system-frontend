// src/components/InventoryList.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig'; // Use our configured axios instance

function InventoryList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            setError('');
            try {
                // Make sure you are logged in via Django first!
                // This request will send the session cookie because of axios.defaults.withCredentials = true
                const response = await axios.get('/api/v1/inventory/'); // Assuming this endpoint exists
                setItems(response.data); // Assuming the response data is an array of items
            } catch (err) {
                console.error("Error fetching inventory:", err);
                if (err.response) {
                    // Handle specific HTTP error statuses
                    if (err.response.status === 401 || err.response.status === 403) {
                         setError('Authentication required. Please log in via the Django admin or login page.');
                    } else {
                         setError(`Error: ${err.response.status} ${err.response.statusText}`);
                    }
                } else if (err.request) {
                    setError('Network Error: Could not connect to the backend. Is it running?');
                } else {
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <p>Loading inventory...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Inventory Items</h2>
            {items.length > 0 ? (
                <ul>
                    {/* Adjust 'item.name' based on your actual Inventory model/serializer fields */}
                    {items.map(item => (
                        <li key={item.id}>{item.name} - Quantity: {item.quantity}</li>
                    ))}
                </ul>
            ) : (
                <p>No inventory items found.</p>
            )}
        </div>
    );
}

export default InventoryList;
