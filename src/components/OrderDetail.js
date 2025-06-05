import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [updating, setUpdating] = useState(false);
    const [addingItem, setAddingItem] = useState(false);

    // For table and items
    const [tables, setTables] = useState([]);
    const [table, setTable] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        item: '',
        quantity: 1,
    });

    useEffect(() => {
        const fetchOrderData = async () => {
            setLoading(true);
            setError('');
            try {
                const orderResponse = await axios.get(`/api/v1/orders/${id}/`);
                setOrder(orderResponse.data);
                setStatus(orderResponse.data.order_status);
                setTable(orderResponse.data.table);
                setItems(orderResponse.data.items || []);

                const tablesResponse = await axios.get('/api/v1/tables/');
                setTables(tablesResponse.data);

                const menuItemsResponse = await axios.get('/api/v1/menuitems/');
                setMenuItems(menuItemsResponse.data);
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        try {
            await axios.delete(`/api/v1/orders/${id}/`);
            navigate('/');
        } catch (err) {
            setError('Failed to delete order.');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`/api/v1/orderitems/${itemId}/`);
            setItems(items.filter((item) => item.id !== itemId));
        } catch (err) {
            setError('Failed to delete order item.');
        }
    };

    const handleAddItem = async () => {
        try {
            const newItemToCreate = {
                menu_item: newItem.item,
                quantity: newItem.quantity,
                order: id,
            };
            console.log("newItemToCreate", newItemToCreate)
            await axios.post(`/api/v1/orderitems/`, newItemToCreate);
            setAddingItem(false);
            setNewItem({ item: '', quantity: 1 });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add order item.');
        }
    };

    const renderAddItemForm = () => {
        return (
            <div>
                <label>Menu Item:</label>
                <select
                    value={newItem.item}
                    onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                >
                    <option value="">Select Item</option>
                    {menuItems.map(mi => (
                                    <option key={mi.id} value={mi.id}>
                                        {mi.name}
                                    </option>
                                ))}
                </select>
                <label>Quantity:</label>
                <input
                    type="number"
                    min="1"
                    defaultValue={1}
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                />
                <button type="button" onClick={handleAddItem}>Create Item</button>
            </div>
        );
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');
        try {
            // Update order status and table
            const orderResponse = await axios.put(`/api/v1/orders/${id}/`, {
                order_status: status,
                table,
            });

            setOrder(orderResponse.data);
            setStatus(orderResponse.data.order_status);
            setTable(orderResponse.data.table);
            setItems(orderResponse.data.items || []);

        } catch (err) {
            setError('Failed to update order.');
        } finally {
            setUpdating(false);
        }
    };

    const handleItemChange = (idx, value) => {
        setItems(items.map((item, i) => {
            const selectedMenuItem = menuItems.find(mi => String(mi.id) === String(value));
            return i === idx
                ? {
                    ...item,
                    id: value,
                    item_name: selectedMenuItem ? selectedMenuItem.name : '',
                    item_price: selectedMenuItem ? selectedMenuItem.price : 0,
                }
                : item;
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!order) return <p>No order found.</p>;

    return (
        <div>
            <h2>Order #{order.id} Details</h2>
            <p>Status: {order.order_status}</p>
            <p>Amount: {order.total_amount}</p>
            <p>Table: {order.table_details ? order.table_details.name : order.table}</p>
            <p>Created: {order.c_at ? new Date(order.c_at).toLocaleString() : ''}</p>
            <h3>Items</h3>
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
            <form onSubmit={handleUpdate} style={{ margin: '16px 0' }}>
                <label>
                    Update Status:
                    <select value={status} onChange={e => setStatus(e.target.value)} disabled={updating}>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </label>
                <br />
                <label>
                    Change Table:
                    <select value={table} onChange={e => setTable(e.target.value)} disabled={updating}>
                        <option value="">Select table</option>
                        {tables.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </label>
                <br />
                <label>Order Items:</label>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {items.map((item, idx) => (
                        <li key={item.id} style={{ marginBottom: 8 }}>
                            <select
                                value={item.id}
                                onChange={(e) => handleItemChange(idx, e.target.value)}
                                disabled={updating}
                                style={{ marginRight: 8 }}
                            >
                                <option value="">Select item</option>
                                {menuItems.map(mi => (
                                    <option key={mi.id} value={mi.id}>
                                        {mi.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={() => { }}
                                disabled={updating}
                                style={{ width: 60, marginRight: 8 }}
                            />
                            <button type="button" onClick={() => handleRemoveItem(item.id)} disabled={updating}>Remove</button>
                        </li>
                    ))}
                </ul>
                {!addingItem && (
                    <button
                        type="button"
                        onClick={() => setAddingItem(true)}
                        disabled={updating || menuItems.length === 0}
                        style={{ marginBottom: 8 }}
                    >
                        Add Item
                    </button>
                )}
                {addingItem && renderAddItemForm()}
                <br />
                <button className="jowi-btn" type="submit" disabled={updating} style={{ marginLeft: 8 }}>
                    {updating ? 'Updating...' : 'Update'}
                </button>
            </form>
            <button className="jowi-btn" onClick={handleDelete} style={{ marginRight: 8 }}>Delete Order</button>
            <button className="jowi-btn" onClick={() => navigate('/')}>Back to Orders</button>
        </div>
    );
}

export default OrderDetail;
