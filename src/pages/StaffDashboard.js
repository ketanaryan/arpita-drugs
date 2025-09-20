import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { registerBatch } from '../services/blockchainService';
import InputField from '../components/InputField';
import './Dashboard.css';

function StaffDashboard() {
  const [batchId, setBatchId] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', manufacturingDate: '', expiryDate: '', quantity: '' }
  ]);
  const [qrValue, setQrValue] = useState('');
  const [txHash, setTxHash] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const addMedicineEntry = () => {
    setMedicines([...medicines, { name: '', manufacturingDate: '', expiryDate: '', quantity: '' }]);
  };

  const removeMedicineEntry = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setTxHash('');
    setQrValue('');

    if (!batchId.trim()) {
      setMessage('Error: Batch ID cannot be empty.');
      return;
    }
    if (medicines.length === 0 || medicines.some(med => !med.name || !med.quantity || !med.expiryDate || !med.manufacturingDate)) {
        setMessage('Error: All medicine fields must be filled.');
        return;
    }

    try {
      const tx = await registerBatch(batchId, medicines);
      setTxHash(tx.hash);
      const verificationUrl = `${window.location.origin}/verify/${batchId}`;
      setQrValue(verificationUrl);
      setMessage(`Batch registered successfully! Transaction Hash: ${tx.hash}`);

      setBatchId('');
      setMedicines([{ name: '', manufacturingDate: '', expiryDate: '', quantity: '' }]);

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="header-bar">
        <h2>Staff Dashboard <span className="welcome-text">({user?.email})</span></h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Register New Batch</h3>
          <form onSubmit={handleRegister}>
            {message && <p className="status-message">{message}</p>}
            <InputField
              label="Batch ID:"
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
              placeholder="e.g., DRUG-123"
            />

            <h4>Medicine Entries:</h4>
            {medicines.map((medicine, index) => (
              <div key={index} className="medicine-entry">
                <InputField
                  label="Medicine Name:"
                  type="text"
                  value={medicine.name}
                  onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                  required
                  placeholder="e.g., Paracetamol 500mg"
                />
                <InputField
                  label="Quantity:"
                  type="number"
                  value={medicine.quantity}
                  onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                  required
                  placeholder="e.g., 100"
                />
                <InputField
                  label="Manufacturing Date:"
                  type="date"
                  value={medicine.manufacturingDate}
                  onChange={(e) => handleMedicineChange(index, 'manufacturingDate', e.target.value)}
                  required
                />
                <InputField
                  label="Expiry Date:"
                  type="date"
                  value={medicine.expiryDate}
                  onChange={(e) => handleMedicineChange(index, 'expiryDate', e.target.value)}
                  required
                />
                {medicines.length > 1 && (
                  <button type="button" className="remove-button" onClick={() => removeMedicineEntry(index)}>
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-medicine-button" onClick={addMedicineEntry}>
              Add Another Medicine
            </button>
            
            <button type="submit" style={{ marginTop: '2em' }}>Register Batch on Blockchain</button>
          </form>
        </div>

        {qrValue && (
          <div className="dashboard-card qr-card">
            <h3>QR Label to Print</h3>
            <div className="qr-code">
              <QRCodeCanvas value={qrValue} size={200} level="H" />
            </div>
            <p className="qr-info">Scan this QR code to verify the batch.</p>
            <p className="status-message">Transaction Hash: {txHash}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffDashboard;