import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InventoryList from './components/InventoryList';
import Login from './components/Login';
import OrderItemList from './components/OrderItem';
import TableList from './components/Table';
import Reservations from './components/Resevation';
import MenuItemList from './components/MenuItem';
import MenuIngredients from './components/Menu-ingriedent';
import Users from './components/user';
import AuditLogPage from './components/logs';
import OrderPage from './components/orderPage';
import OrderDetail from './components/OrderDetail';
import CreateInventory from './components/createinventory';
import InventoryDetail from './components/inventorydetail';
import './components/main.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [page, setPage] = useState('orders');

    // Check for JWT token in localStorage on app load
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="jowi-login-bg">
                <div className="jowi-login-card">
                    <h1>Waiter System</h1>
                    <Login onLogin={() => setIsAuthenticated(true)} />
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="jowi-app">
                <aside className="jowi-sidebar">
                    <div className="jowi-logo">WaiterSys</div>
                    <nav>
                        <Link to="/orders" className={page === 'orders' ? 'active' : ''} onClick={() => setPage('orders')}>Orders</Link>
                        <Link to="/inventory" className={page === 'inventory' ? 'active' : ''} onClick={() => setPage('inventory')}>Inventory</Link>
                        <Link to="/orderitem" className={page === 'orderitem' ? 'active' : ''} onClick={() => setPage('orderitem')}>Order Items</Link>
                        <Link to="/tables" className={page === 'table' ? 'active' : ''} onClick={() => setPage('table')}>Tables</Link>
                        <Link to="/reservations" className={page === 'reservation' ? 'active' : ''} onClick={() => setPage('reservation')}>Reservations</Link>
                        <Link to="/menuitem" className={page === 'menuitem' ? 'active' : ''} onClick={() => setPage('menuitem')}>Menu Items</Link>
                        <Link to="/menuingriedent" className={page === 'menuingriedent' ? 'active' : ''} onClick={() => setPage('menuingriedent')}>Menu Ingredients</Link>
                        <Link to="/users" className={page === 'users' ? 'active' : ''} onClick={() => setPage('users')}>Users</Link>
                        <Link to="/logs" className={page === 'logs' ? 'active' : ''} onClick={() => setPage('logs')}>Audit Logs</Link>
                    </nav>
                    <button className="jowi-logout" onClick={handleLogout}>Logout</button>
                </aside>
                <main className="jowi-main">
                    <header className="jowi-topbar">
                        <h2>{page.replace(/^\w/, c => c.toUpperCase())}</h2>
                    </header>
                    <section className="jowi-content">
                        <Routes>
                            <Route path="/orders" element={<OrderPage />} />
                            <Route path="/inventory/*" element={<InventoryList />} />
                            <Route path="/orderitem" element={<OrderItemList />} />
                            <Route path="/reservations" element={<Reservations />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/tables" element={<TableList />} />
                            <Route path="/menuingriedent" element={<MenuIngredients />} />
                            <Route path="/logs" element={<AuditLogPage />} />
                            <Route path="/menuitem" element={<MenuItemList />} />
                            <Route path="/orders/:id" element={<OrderDetail />} />
                            <Route path="/createinventory" element={<CreateInventory />} />
                            <Route path="/inventory/:id" element={<InventoryDetail />} />
                            <Route path="/" element={<OrderPage />} /> {/* Default route */}
                        </Routes>
                    </section>
                </main>
            </div>
        </Router>
    );
}

export default App;