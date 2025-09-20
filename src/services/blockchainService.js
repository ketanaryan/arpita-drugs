// This service makes network requests to a simple backend API
// instead of using the browser's local storage.

const API_BASE_URL = window.location.origin;

export const registerBatch = async (batchId, medicines) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/batches?batchId=${batchId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ medicines, status: 'Authentic' })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to register batch.');
        }

        return { hash: `mock_tx_${Date.now()}`, message: data.message };

    } catch (error) {
        console.error("API error during registration:", error);
        throw error;
    }
};

export const getBatch = async (batchId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/batches?batchId=${batchId}`);
        
        if (response.status === 404) {
          throw new Error("Batch not found.");
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch batch data');
        }

        const data = await response.json();
        
        let currentStatus = data.status;
        const now = new Date();
        const isExpired = data.medicines.some(med => new Date(med.expiryDate) < now);

        if (isExpired) {
            currentStatus = "Expired";
        }
        
        return { ...data, status: currentStatus };

    } catch (error) {
        console.error("API error during fetching:", error);
        throw error;
    }
};

export const setRecalled = async (batchId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/batches?batchId=${batchId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: "Recalled" })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to recall batch.');
        }
        
        return "Recalled";
        
    } catch (error) {
        console.error("API error during recall:", error);
        throw error;
    }
};