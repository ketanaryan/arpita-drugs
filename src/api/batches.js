const data = {};

module.exports = (req, res) => {
  const { batchId } = req.query;

  if (req.method === 'POST') {
    const { medicines, status } = req.body;
    if (data[batchId]) {
      res.status(409).json({ error: 'Batch already exists.' });
      return;
    }
    data[batchId] = { medicines, status };
    res.status(200).json({ message: 'Batch registered successfully.' });

  } else if (req.method === 'GET') {
    const batch = data[batchId];
    if (batch) {
      res.status(200).json(batch);
    } else {
      res.status(404).json({ error: 'Batch not found.' });
    }

  } else if (req.method === 'PATCH') {
    const { status } = req.body;
    const batch = data[batchId];
    if (!batch) {
        res.status(404).json({ error: 'Batch not found.' });
        return;
    }
    batch.status = status;
    res.status(200).json({ message: 'Batch status updated successfully.' });

  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};