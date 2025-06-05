import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

function InventoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: '',
        quantity: '',
        unit_of_measure: '',
        description: '',
        price: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError('');
        axios.get(`/api/v1/inventory/${id}/`)
            .then(res => {
                setItem(res.data);
                setForm({
                    name: res.data.name || '',
                    quantity: res.data.quantity || '',
                    unit_of_measure: res.data.unit_of_measure || '',
                    description: res.data.description || '',
                    price: res.data.price || '',
                });
            })
            .catch(() => setError('Failed to fetch inventory item.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
        try {
            await axios.delete(`/api/v1/inventory/${id}/`);
            navigate('/inventory');
        } catch {
            setError('Failed to delete inventory item.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const res = await axios.put(`/api/v1/inventory/${id}/`, form);
            setItem(res.data);
            setEditing(false);
        } catch {
            setError('Failed to update inventory item.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!item) return <p>No inventory item found.</p>;

    return (
        <div>
            <h2>Inventory Item Details</h2>
            {!editing ? (
                <div>
                    <p><b>Name:</b> {item.name}</p>
                    <p><b>Quantity:</b> {item.quantity}</p>
                    <p><b>Unit of Measure:</b> {item.unit_of_measure}</p>
                    <p><b>Description:</b> {item.description}</p>
                    <p><b>Price:</b> {item.price}</p>
                    <p><b>Created:</b> {item.c_at ? new Date(item.c_at).toLocaleString() : ''}</p>
                    <p><b>Updated:</b> {item.u_at ? new Date(item.u_at).toLocaleString() : ''}</p>
                    <button className="jowi-btn" onClick={() => setEditing(true)} style={{ marginRight: 8 }}>
                        Edit
                    </button>
                    <button className="jowi-btn" onClick={handleDelete} style={{ marginRight: 8 }}>
                        Delete
                    </button>
                    <button className="jowi-btn" onClick={() => navigate('/inventory')}>
                        Back to Inventory
                    </button>
                </div>
            ) : (
                <form onSubmit={handleUpdate}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Quantity:
                        <input
                            type="number"
                            name="quantity"
                            min="0"
                            step="0.01"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Unit of Measure:
                        <input
                            type="text"
                            name="unit_of_measure"
                            value={form.unit_of_measure}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Price:
                        <input
                            type="number"
                            name="price"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <button className="jowi-btn" type="submit" disabled={saving} style={{ marginRight: 8 }}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="jowi-btn" type="button" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
}

export default InventoryDetail;
