// test/test.js

const axios = require('axios');

// Base URL of your local or deployed server
const BASE_URL = 'http://localhost:5000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testIngestionFlow() {
  try {
    console.log('\n👉 Sending MEDIUM priority request...');
    const res1 = await axios.post(`${BASE_URL}/ingest`, {
      ids: [1, 2, 3, 4, 5],
      priority: 'MEDIUM'
    });
    const ingestionId1 = res1.data.ingestion_id;
    console.log('Ingestion ID 1:', ingestionId1);

    // Wait 4 seconds
    await sleep(4000);

    console.log('\n👉 Sending HIGH priority request...');
    const res2 = await axios.post(`${BASE_URL}/ingest`, {
      ids: [6, 7, 8, 9],
      priority: 'HIGH'
    });
    const ingestionId2 = res2.data.ingestion_id;
    console.log('Ingestion ID 2:', ingestionId2);

    // Poll status every 5 seconds for 20 seconds
    for (let i = 1; i <= 4; i++) {
      console.log(`\n🔄 Status check #${i}`);
      const [status1, status2] = await Promise.all([
        axios.get(`${BASE_URL}/status/${ingestionId1}`),
        axios.get(`${BASE_URL}/status/${ingestionId2}`)
      ]);

      console.log(`Status of ${ingestionId1} (${status1.data.status}):`);
      console.log(status1.data.batches.map(b => ({ ids: b.ids, status: b.status })));

      console.log(`\nStatus of ${ingestionId2} (${status2.data.status}):`);
      console.log(status2.data.batches.map(b => ({ ids: b.ids, status: b.status })));

      await sleep(5000);
    }

    console.log('\n✅ Test complete.');

  } catch (err) {
    console.error('❌ Error in test:', err.message);
  }
}

testIngestionFlow();
