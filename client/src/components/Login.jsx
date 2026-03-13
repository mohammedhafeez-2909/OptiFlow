import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
       try {
            const res = await axios.post('http://localhost:5000/api/login', { email, password });
            localStorage.setItem('token', res.data.token);
            
            // This is the "Engine" that moves you to the next page
            navigate('/dashboard'); 
        } catch (err) {
            alert("Access Denied: " + (err.response?.data?.message || "Connection Error"));
        }
    };

    return (
        <div style={styles.container}>
            {/* Advanced CSS Animations */}
            <style>
                {`
                @keyframes backgroundMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes borderRotate {
                    0% { border-image-source: linear-gradient(0deg, #6366f1, #a855f7, #06b6d4); }
                    100% { border-image-source: linear-gradient(360deg, #6366f1, #a855f7, #06b6d4); }
                }

                @keyframes shimmer {
                    0% { transform: translateX(-150%); }
                    100% { transform: translateX(150%); }
                }

                .ultra-card {
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(20px);
                    border: 2px solid transparent;
                    border-image: linear-gradient(45deg, #6366f1, #06b6d4) 1;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .ultra-card:hover {
                    box-shadow: 0 0 50px rgba(99, 102, 241, 0.3);
                }

                .shimmer-btn {
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(90deg, #6366f1, #a855f7);
                    transition: all 0.3s ease;
                }

                .shimmer-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 50%; height: 100%;
                    background: rgba(255, 255, 255, 0.2);
                    transform: skewX(-25deg);
                    animation: shimmer 2s infinite;
                }

                .shimmer-btn:hover {
                    transform: scale(1.02);
                    box-shadow: 0 0 25px rgba(168, 85, 247, 0.5);
                }

                .input-field {
                    background: rgba(0, 0, 0, 0.3) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #fff !important;
                    transition: 0.3s;
                }

                .input-field:focus {
                    border-color: #06b6d4 !important;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
                }
                `}
            </style>

            <div className="ultra-card" style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>OPTIFLOW</h1>
                    <div style={styles.titleUnderline}></div>
                </div>
                <p style={styles.subtitle}>NEURAL INVENTORY NETWORK</p>
                
                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>CREDENTIAL_ID</label>
                        <input 
                            className="input-field"
                            type="email" 
                            placeholder="admin@optiflow.io" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>AUTH_KEY</label>
                        <input 
                            className="input-field"
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className="shimmer-btn" style={styles.button}>
                        ESTABLISH UPLINK
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#020617',
        backgroundImage: 'linear-gradient(-45deg, #020617, #0f172a, #1e1b4b, #020617)',
        backgroundSize: '400% 400%',
        animation: 'backgroundMove 15s ease infinite',
        overflow: 'hidden',
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        padding: '50px',
        borderRadius: '4px', // Modern sharp edges or subtle round
        textAlign: 'center',
    },
    header: {
        marginBottom: '10px',
    },
    title: {
        margin: '0',
        fontSize: '3rem',
        fontWeight: '900',
        color: '#fff',
        letterSpacing: '8px',
        textShadow: '0 0 20px rgba(99, 102, 241, 0.8)',
    },
    titleUnderline: {
        height: '2px',
        width: '50px',
        background: '#06b6d4',
        margin: '5px auto',
        boxShadow: '0 0 10px #06b6d4',
    },
    subtitle: {
        margin: '0 0 40px',
        color: '#94a3b8',
        fontSize: '0.65rem',
        letterSpacing: '4px',
    },
    inputGroup: {
        textAlign: 'left',
        marginBottom: '25px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '0.6rem',
        fontWeight: '900',
        color: '#06b6d4',
        letterSpacing: '2px',
    },
    input: {
        width: '100%',
        padding: '16px',
        borderRadius: '0px',
        fontSize: '0.9rem',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '18px',
        color: 'white',
        border: 'none',
        fontSize: '0.8rem',
        fontWeight: '900',
        cursor: 'pointer',
        marginTop: '10px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
    }
};

export default Login;