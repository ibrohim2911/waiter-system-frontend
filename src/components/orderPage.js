import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import CreateOrder from './CreateOrder';
import { useNavigate } from 'react-router-dom';

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/v1/orders/');
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [showCreate]); // Refresh after creating

    if (showCreate) {
        return <CreateOrder onDone={() => setShowCreate(false)} />;
    }

    return (
        <div className="order-container">
            <h2>My Orders</h2>
            <button className="jowi-btn" onClick={() => setShowCreate(true)}>Create New Order</button>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <ul className="order-list">
                    {orders.map(order => (
                        <li key={order.id}>
                            <strong>Order #{order.id}</strong> | 
                            Status: {order.order_status} | 
                            Amount: {order.total_amount} | 
                            Table: {order.table_details ? order.table_details.name : order.table} | 
                            Created: {order.c_at ? new Date(order.c_at).toLocaleString() : ''}
                            <div>
                                <strong>Items:</strong>
                                <ul>
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map(item => (
                                            <li key={item.id}>
                                                {item.item_name} (x{item.quantity}) - {item.item_price} each
                                            </li>
                                        ))
                                    ) : (
                                        <li>No items</li>
                                    )}
                                </ul>
                            </div>
                            <button
                                className="jowi-btn order-detail-btn"
                                onClick={() => navigate(`/orders/${order.id}`)}
                                style={{ marginTop: '8px', backgroundColor: '#1976d2', color: '#fff', borderRadius: '4px', border: 'none', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1565c0'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#1976d2'}
                            >
                                View Details
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OrderPage;