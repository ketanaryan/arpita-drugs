import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setRecalled } from '../services/blockchainService';
import InputField from '../components/InputField';
import './Dashboard.css';

function AdminDashboard() {
  const [batchId, setBatchId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleRecall = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await setRecalled(batchId);
      setMessage({ type: 'success', text: `Batch ${batchId} has been successfully recalled.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="header-bar">
        <h2>Admin Dashboard <span className="welcome-text">({user?.email})</span></h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Recall Batch</h3>
          <form onSubmit={handleRecall}>
            {message && (
              <p className={message.type === 'success' ? 'success-message' : 'error-message'}>
                {message.text}
              </p>
            )}
            <InputField
              label="Batch ID to Recall:"
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
              placeholder="e.g., DRUG-123"
            />
            <button type="submit">Recall Batch</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;