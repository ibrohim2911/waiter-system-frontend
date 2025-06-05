import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import './inventory.css';

function OrderItemList() {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderItems = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/v1/orderitems/');
                setOrderItems(response.data);
            } catch (err) {
                setError('Failed to fetch order items.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderItems();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="inventory-container">
            <h2>Order Items</h2>
            {loading ? (
                <p>Loading...</p>
            ) : orderItems.length > 0 ? (
                <ul className="inventory-list">
                    {orderItems.map(item => (
                        <li key={item.id}>
                            <strong>{item.item_name}</strong> (ID: {item.id})<br />
                            Order: {item.order} <br />
                            Menu Item: {item.menu_item} <br />
                            Quantity: {item.quantity} <br />
                            Price: {item.item_price}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No order items found.</p>
            )}
        </div>
    );
}

export default OrderItemList;