import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBatch } from '../services/blockchainService';
import './Dashboard.css';

function VerifyPage() {
    const { batchId } = useParams();
    const [batchDetails, setBatchDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBatchDetails = async () => {
            try {
                const details = await getBatch(batchId);
                setBatchDetails(details);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBatchDetails();
    }, [batchId]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'Authentic':
                return 'status-authentic';
            case 'Recalled':
                return 'status-recalled';
            case 'Expired':
                return 'status-expired';
            default:
                return 'status-default';
        }
    };

    return (
        <div className="dashboard-container">
            <div className="header-bar">
                <h2>Batch Verification</h2>
                {localStorage.getItem('user') && (
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                )}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Batch ID: {batchId}</h3>
                    {loading && <p className="status-message">Fetching batch details...</p>}
                    {error && <p className="error-message">{error}</p>}
                    
                    {!loading && !error && batchDetails && (
                        <div>
                            <p className={`status-message ${getStatusClass(batchDetails.status)}`}>
                                Status: <strong>{batchDetails.status}</strong>
                            </p>
                            
                            <h4>Medicine Details:</h4>
                            {batchDetails.medicines.map((med, index) => (
                                <div key={index} className="medicine-entry">
                                    <p><strong>Name:</strong> {med.name}</p>
                                    <p><strong>Quantity:</strong> {med.quantity}</p>
                                    <p><strong>Manufacturing Date:</strong> {med.manufacturingDate}</p>
                                    <p><strong>Expiry Date:</strong> {med.expiryDate}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {!loading && !error && !batchDetails && (
                        <p className="error-message">This batch ID was not found on the system.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifyPage;