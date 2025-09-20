import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and public key
const SUPABASE_URL = 'https://rmovllkwnypamcoivsrh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtb3ZsbGt3bnlwYW1jb2l2c3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODUwODUsImV4cCI6MjA3Mzk2MTA4NX0.6C3Wzb76AohvfOPjSyfMxmON8GcpOZyz22D87JOx-nY';

// Create a single Supabase client for your app
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Registers a new medicine batch in the Supabase database.
 * @param {string} batchId The unique ID for the batch.
 * @param {Array<Object>} medicines An array of medicine objects to be stored.
 */
export const registerBatch = async (batchId, medicines) => {
    try {
        const { data, error } = await supabase
            .from('batches')
            .insert([
                { batch_id: batchId, medicines: medicines }
            ])
            .select(); // Use .select() to get the inserted data

        if (error) {
            throw new Error(error.message);
        }

        return { hash: `supabase_tx_${Date.now()}`, message: 'Batch registered successfully.' };

    } catch (error) {
        console.error("Supabase error during registration:", error);
        throw error;
    }
};

/**
 * Retrieves a full batch object from the Supabase database.
 * @param {string} batchId The unique ID of the batch to retrieve.
 * @returns {Promise<Object>} The full batch object, including medicines and status.
 */
export const getBatch = async (batchId) => {
    try {
        const { data, error } = await supabase
            .from('batches')
            .select('*')
            .eq('batch_id', batchId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Error code for "no rows found"
                throw new Error("Batch not found.");
            }
            throw new Error(error.message);
        }
        
        // Logic to check status based on the retrieved data
        let currentStatus = data.status;
        const now = new Date();
        const isExpired = data.medicines.some(med => new Date(med.expiryDate) < now);

        if (isExpired) {
            currentStatus = "Expired";
        }
        
        return { ...data, status: currentStatus };

    } catch (error) {
        console.error("Supabase error during fetching:", error);
        throw error;
    }
};

/**
 * Updates a batch's status to "Recalled" in the Supabase database.
 * @param {string} batchId The unique ID of the batch to recall.
 */
export const setRecalled = async (batchId) => {
    try {
        const { data, error } = await supabase
            .from('batches')
            .update({ status: 'Recalled' })
            .eq('batch_id', batchId)
            .select();

        if (error) {
            throw new Error(error.message);
        }
        
        return "Recalled";
        
    } catch (error) {
        console.error("Supabase error during recall:", error);
        throw error;
    }
};