// routes/ingest.js

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { ingestions, queue, batchStatus } = require('../storage/memory');

// Helper to split array into chunks of size n
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

// POST /ingest
router.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;

  if (!Array.isArray(ids) || !priority) {
    return res.status(400).json({ error: 'Invalid request format' });
  }

  const ingestionId = uuidv4();
  const createdAt = new Date();

  const batches = chunkArray(ids, 3).map(batchIds => {
    const batchId = uuidv4();
    batchStatus[batchId] = {
      ids: batchIds,
      status: 'yet_to_start'
    };
    return { batchId, ids: batchIds, status: 'yet_to_start' };
  });

  ingestions[ingestionId] = {
    ingestionId,
    status: 'yet_to_start',
    batches
  };

  // Push to global queue (with one entry per batch)
  batches.forEach(({ batchId, ids }) => {
    queue.push({
      ingestionId,
      batchId,
      ids,
      priority,
      createdAt
    });
  });

  return res.status(200).json({ ingestion_id: ingestionId });
});

// GET /status/:ingestion_id
router.get('/status/:ingestion_id', (req, res) => {
  const { ingestion_id } = req.params;
  const data = ingestions[ingestion_id];

  if (!data) {
    return res.status(404).json({ error: 'Ingestion ID not found' });
  }

  const batchStates = data.batches.map(b => batchStatus[b.batchId].status);

  let overallStatus = 'yet_to_start';
  if (batchStates.every(s => s === 'completed')) {
    overallStatus = 'completed';
  } else if (batchStates.some(s => s === 'triggered')) {
    overallStatus = 'triggered';
  }

  return res.json({
    ingestion_id: ingestion_id,
    status: overallStatus,
    batches: data.batches.map(b => ({
      batch_id: b.batchId,
      ids: b.ids,
      status: batchStatus[b.batchId].status
    }))
  });
});

module.exports = router;
