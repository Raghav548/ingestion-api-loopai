const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function submitBatch(ids, priority) {
  try {
    const res = await axios.post(`${BASE_URL}/ingest`, { ids, priority });
    console.log(`👉 Submitted ${priority} priority batch. Ingestion ID: ${res.data.ingestion_id}`);
    return res.data.ingestion_id;
  } catch (err) {
    console.error('Error submitting batch:', err.message);
  }
}

async function checkStatus(ingestionId) {
  try {
    const res = await axios.get(`${BASE_URL}/status/${ingestionId}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching status:', err.message);
  }
}

async function runTest() {
  console.log('--- Starting edge cases test ---');

  // Submit multiple LOW priority batches
  const low1 = await submitBatch([10, 11, 12], 'LOW');
  const low2 = await submitBatch([13, 14], 'LOW');

  // Submit mixed priority batches quickly
  const high = await submitBatch([1, 2, 3], 'HIGH');
  const med1 = await submitBatch([4, 5, 6], 'MEDIUM');
  const med2 = await submitBatch([7, 8], 'MEDIUM');

  const ingestionIds = [low1, low2, high, med1, med2];

  // Poll status 6 times every 5 seconds
  for (let i = 1; i <= 6; i++) {
    console.log(`\n🔄 Status check #${i}`);

    for (const id of ingestionIds) {
      if (!id) continue;
      const status = await checkStatus(id);
      console.log(`Status of ${id} (${status.status}):`);
      status.batches.forEach(batch => {
        console.log(`  Batch ids: [${batch.ids.join(', ')}], status: ${batch.status}`);
      });
    }

    await new Promise(r => setTimeout(r, 5000)); // wait 5 sec before next status check
  }

  console.log('\n✅ Edge cases test complete.');
}

runTest();
