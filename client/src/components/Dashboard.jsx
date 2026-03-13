import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    
    // States for adding/editing
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [stock, setStock] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (err) {
            navigate('/');
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const payload = { name, sku, stock_quantity: stock, category: 'General', price: 0, reorder_level: 5 };
        
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/products/${selectedProductId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/products', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            resetForm();
            fetchProducts();
        } catch (err) {
            alert("Operation failed");
        }
    };

    const resetForm = () => {
        setName(''); setSku(''); setStock('');
        setIsEditing(false); setSelectedProductId(null);
    };

    const handleEditClick = (p) => {
        setIsEditing(true);
        setSelectedProductId(p.id);
        setName(p.name);
        setSku(p.sku);
        setStock(p.stock_quantity);
    };

    const openDeleteModal = (id) => {
        setSelectedProductId(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/products/${selectedProductId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            fetchProducts();
        } catch (err) { console.error(err); }
    };

    // Filter Logic for Search
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = products.filter(p => p.stock_quantity < 20).length;

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <h2 style={styles.logo}>OPTIFLOW // <span style={{color: '#06b6d4'}}>CORE_OS</span></h2>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                    <input 
                        type="text" 
                        placeholder="SEARCH ASSETS..." 
                        style={styles.searchInput} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={() => {localStorage.removeItem('token'); navigate('/')}} style={styles.logoutBtn}>TERMINATE</button>
                </div>
            </nav>

            <div style={styles.content}>
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>TOTAL ASSETS</p>
                        <h3 style={styles.statValue}>{products.length}</h3>
                    </div>
                    <div style={{...styles.statCard, borderLeftColor: '#ef4444'}}>
                        <p style={styles.statLabel}>LOW STOCK ALERTS</p>
                        <h3 style={{...styles.statValue, color: '#ef4444'}}>{lowStockCount}</h3>
                    </div>
                    <div style={{...styles.statCard, borderLeftColor: '#10b981'}}>
                        <p style={styles.statLabel}>SYSTEM INTEGRITY</p>
                        <h3 style={{...styles.statValue, color: '#10b981'}}>100%</h3>
                    </div>
                </div>

                <form onSubmit={handleSaveProduct} style={styles.addForm}>
                    <h4 style={{color: '#6366f1', margin: '0 0 10px', fontSize: '0.7rem'}}>{isEditing ? 'MODIFYING ASSET' : 'NEW ASSET REGISTRATION'}</h4>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input type="text" placeholder="NAME" value={name} onChange={e => setName(e.target.value)} style={styles.miniInput} required />
                        <input type="text" placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} style={styles.miniInput} required />
                        <input type="number" placeholder="STOCK" value={stock} onChange={e => setStock(e.target.value)} style={styles.miniInput} required />
                        <button type="submit" style={styles.addBtn}>{isEditing ? 'UPDATE' : 'REGISTER'}</button>
                        {isEditing && <button onClick={resetForm} style={styles.cancelBtn}>CANCEL</button>}
                    </div>
                </form>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>PRODUCT NAME</th>
                                <th style={styles.th}>SKU</th>
                                <th style={styles.th}>STOCK</th>
                                <th style={styles.th}>STATUS</th>
                                <th style={styles.th}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.id} style={styles.tr}>
                                    <td style={styles.td}>{p.id}</td>
                                    <td style={styles.td}>{p.name}</td>
                                    <td style={styles.td}>{p.sku}</td>
                                    <td style={styles.td}>{p.stock_quantity}</td>
                                    <td style={styles.td}>
                                        <span style={p.stock_quantity < 20 ? styles.lowStock : styles.inStock}>
                                            {p.stock_quantity < 20 ? 'CRITICAL' : 'OPTIMAL'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button onClick={() => handleEditClick(p)} style={styles.editBtn}>EDIT</button>
                                        <button onClick={() => openDeleteModal(p.id)} style={styles.deleteBtn}>DELETE</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        <h3 style={styles.modalTitle}>CONFIRM DE-REGISTRATION</h3>
                        <p style={styles.modalText}>Warning: Permanent removal of asset from database.</p>
                        <div style={styles.modalActions}>
                            <button onClick={() => setIsModalOpen(false)} style={styles.cancelBtn}>ABORT</button>
                            <button onClick={confirmDelete} style={styles.confirmBtn}>CONFIRM</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#020617', color: '#fff', fontFamily: 'monospace' },
    navbar: { display: 'flex', justifyContent: 'space-between', padding: '15px 40px', borderBottom: '1px solid #1e293b', background: '#0f172a', alignItems: 'center' },
    logo: { margin: 0, letterSpacing: '4px', fontSize: '1rem' },
    searchInput: { background: '#020617', border: '1px solid #6366f1', color: '#fff', padding: '8px 15px', borderRadius: '20px', width: '250px', outline: 'none', fontSize: '0.8rem' },
    logoutBtn: { background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '5px 12px', cursor: 'pointer', fontSize: '0.6rem' },
    content: { padding: '30px 40px' },
    statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
    statCard: { flex: 1, padding: '20px', background: '#0f172a', borderLeft: '4px solid #6366f1', borderRadius: '4px' },
    statLabel: { fontSize: '0.6rem', color: '#94a3b8', margin: '0 0 10px' },
    statValue: { fontSize: '1.8rem', margin: 0 },
    addForm: { background: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '25px' },
    miniInput: { background: '#020617', border: '1px solid #1e293b', color: '#fff', padding: '10px', borderRadius: '4px', flex: 1, outline: 'none' },
    addBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    cancelBtn: { background: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8', padding: '10px', borderRadius: '4px', cursor: 'pointer' },
    tableWrapper: { background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '15px', color: '#6366f1', fontSize: '0.75rem', borderBottom: '1px solid #1e293b', background: '#111827' },
    td: { padding: '15px', fontSize: '0.85rem', borderBottom: '1px solid #020617' },
    lowStock: { color: '#ef4444', fontWeight: 'bold' },
    inStock: { color: '#10b981', fontWeight: 'bold' },
    editBtn: { background: 'transparent', color: '#6366f1', border: '1px solid #6366f1', padding: '4px 8px', marginRight: '8px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.65rem' },
    deleteBtn: { background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.65rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalCard: { background: '#0f172a', padding: '30px', borderRadius: '12px', border: '1px solid #ef4444', textAlign: 'center' },
    modalTitle: { color: '#ef4444', margin: '0 0 10px' },
    modalText: { color: '#94a3b8', marginBottom: '20px' },
    confirmBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }
};

export default Dashboard;