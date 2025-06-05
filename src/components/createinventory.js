import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

function CreateInventory() {
    const { id } = useParams(); // If id exists, we're editing
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const [item, setItem] = useState({
        name: '',
        quantity: 1,
        price: 0,
    });

    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`/api/v1/inventory/${id}/`)
                .then(res => {
                    setItem({
                        name: res.data.name,
                        quantity: res.data.quantity,
                        price: res.data.price,
                    });
                })
                .catch(() => setError('Failed to fetch inventory item.'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (id) {
                await axios.put(`/api/v1/inventory/${id}/`, item);
            } else {
                await axios.post('/api/v1/inventory/', item);
            }
            navigate('/inventory');
        } catch (err) {
            setError('Failed to save inventory item.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>{id ? 'Edit' : 'Create'} Inventory Item</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={item.name}
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
                        value={item.quantity}
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
                        value={item.price}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <button className="jowi-btn" type="submit" disabled={saving}>
                    {saving ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update' : 'Create')}
                </button>
                <button className="jowi-btn" type="button" onClick={() => navigate('/inventory')} style={{ marginLeft: 8 }}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default CreateInventory;
