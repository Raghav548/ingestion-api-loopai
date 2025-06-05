// services/processor.js

const { queue, batchStatus } = require('../storage/memory');

// Priority order mapping for comparison
const priorityMap = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
};

// Simulate processing of each ID (mocking external API call)
function simulateFetch(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, data: 'processed' });
    }, 1000); // 1 sec delay per ID
  });
}

// Background processor
function startProcessing() {
  setInterval(async () => {
    if (queue.length === 0) return;

    // Sort queue based on priority and createdAt
    queue.sort((a, b) => {
      const p1 = priorityMap[a.priority];
      const p2 = priorityMap[b.priority];
      if (p1 !== p2) return p1 - p2;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // Pick 1 batch
    const batch = queue.shift();
    const { batchId, ids } = batch;

    console.log(`[${new Date().toISOString()}] 🚀 Triggering batch ${batchId} with IDs: ${ids.join(', ')}`);

    batchStatus[batchId].status = 'triggered';

    // Simulate processing all 3 IDs (in parallel if you want, or sequential)
    for (let id of ids) {
      await simulateFetch(id);
    }

    batchStatus[batchId].status = 'completed';

    console.log(`[${new Date().toISOString()}] ✅ Completed batch ${batchId}`);
  }, 5000); // Run one batch every 5 seconds
}

module.exports = { startProcessing };
