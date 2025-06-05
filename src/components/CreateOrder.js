import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';

function CreateOrder({ onDone }) {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [error, setError] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        axios.get('/api/v1/tables/').then(res => setTables(res.data));
        axios.get('/api/v1/menuitems/').then(res => setMenuItems(res.data));
    }, []);

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/api/v1/orders/', {
                table: Number(selectedTable)
            });
            setOrderId(res.data.id);
        } catch (err) {
            setError(
                err.response?.data?.table?.[0] ||
                err.response?.data?.detail ||
                'Failed to create order.'
            );
        }
    };

    const handleAddOrderItem = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/api/v1/orderitems/', {
                order: orderId,
                menu_item: Number(selectedMenuItem),
                quantity: Number(quantity)
            });
            setOrderItems([...orderItems, res.data]);
            setSelectedMenuItem('');
            setQuantity(1);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                'Failed to add order item.'
            );
        }
    };

    if (!orderId) {
        // Step 1: Create order
        return (
            <div className="order-container">
                <h2>Create New Order</h2>
                <form onSubmit={handleCreateOrder}>
                    <label>Choose Table:</label>
                    <select
                        value={selectedTable}
                        onChange={e => setSelectedTable(e.target.value)}
                        required
                    >
                        <option value="">Select table</option>
                        {tables.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.name} (Capacity: {t.capacity})
                            </option>
                        ))}
                    </select>
                    <button className="jowi-btn" type="submit">Create Order</button>
                    <button className="jowi-btn" type="button" onClick={onDone} style={{marginLeft: 8}}>Cancel</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        );
    }

    // Step 2: Add order items
    return (
        <div className="order-container">
            <h2>Add Items to Order #{orderId}</h2>
            <form onSubmit={handleAddOrderItem}>
                <label>Menu Item:</label>
                <select
                    value={selectedMenuItem}
                    onChange={e => setSelectedMenuItem(e.target.value)}
                    required
                >
                    <option value="">Select menu item</option>
                    {menuItems.map(mi => (
                        <option key={mi.id} value={mi.id}>
                            {mi.name} (Price: {mi.price})
                        </option>
                    ))}
                </select>
                <label>Quantity:</label>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    required
                />
                <button className="jowi-btn" type="submit">Add Item</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h3>Order Items</h3>
            <ul>
                {orderItems.map(item => (
                    <li key={item.id}>
                        {menuItems.find(mi => mi.id === item.menu_item)?.name || item.menu_item} (x{item.quantity})
                    </li>
                ))}
            </ul>
            <button className="jowi-btn" onClick={onDone} style={{marginTop: 16}}>Finish</button>
        </div>
    );
}

export default CreateOrder;