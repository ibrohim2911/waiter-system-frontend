import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import './inventory.css';

function MenuItemList() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMenuItems = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/v1/menuitems/');
                setMenuItems(response.data);
            } catch (err) {
                setError('Failed to fetch menu items.');
            } finally {
                setLoading(false);
            }
        };
        fetchMenuItems();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="inventory-container">
            <h2>Menu Items</h2>
            {loading ? (
                <p>Loading...</p>
            ) : menuItems.length > 0 ? (
                <ul className="inventory-list">
                    {menuItems.map(item => (
                        <li key={item.id}>
                            <strong>{item.name}</strong> (ID: {item.id})<br />
                            Description: {item.description} <br />
                            Price: {item.price} <br />
                            Category: {item.category || 'N/A'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No menu items found.</p>
            )}
        </div>
    );
}

export default MenuItemList;