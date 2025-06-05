import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import './inventory.css';

function MenuIngredients() {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIngredients = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/v1/menu-ingredients/');
                setIngredients(response.data);
            } catch (err) {
                setError('Failed to fetch menu ingredients.');
            } finally {
                setLoading(false);
            }
        };
        fetchIngredients();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="inventory-container">
            <h2>Menu Ingredients</h2>
            {loading ? (
                <p>Loading...</p>
            ) : ingredients.length > 0 ? (
                <ul className="inventory-list">
                    {ingredients.map(ingredient => (
                        <li key={ingredient.id}>
                            <strong>{ingredient.name}</strong> (ID: {ingredient.id})<br />
                            Menu Item: {ingredient.menu_item_name || ingredient.menu_item} <br />
                            Inventory Item: {ingredient.inventory_item_name || ingredient.inventory_item} <br />
                            Quantity: {ingredient.quantity}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No menu ingredients found.</p>
            )}
        </div>
    );
}

export default MenuIngredients;