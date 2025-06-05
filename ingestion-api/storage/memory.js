// storage/memory.js

// Stores ingestion metadata and batch statuses
module.exports = {
    // Ingestions: { ingestionId: { ingestionId, status, batches: [ { batchId, ids, status } ] } }
    ingestions: {},
  
    // Queue of pending batches (each entry has: ingestionId, batchId, ids[], priority, createdAt)
    queue: [],
  
    // Batch status lookup: { batchId: { ids, status } }
    batchStatus: {}
  };
  