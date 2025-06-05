# Ingestion API Service

This is a data ingestion microservice that supports batch processing, prioritization, and asynchronous status tracking. Built as part of a system design assignment, it allows clients to ingest data with configurable priorities and track the processing status of each batch.

## 🚀 Features

- Accepts data ingestion requests with `LOW`, `MEDIUM`, or `HIGH` priority.
- Splits IDs into batches of 3 for processing.
- Processes batches based on priority and request order.
- Provides a status-check endpoint to track ingestion and batch progress.
- Queued and rate-limited background processing.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Queueing**: In-memory JavaScript array (simulating real job queues)
- **Deployment**: [Render](https://render.com)

---

## 📦 API Endpoints

### 1. Ingest Data

**POST** `/ingest`

Submit a list of IDs to ingest, along with a priority level.

#### Request Body

```json
{
  "ids": [1, 2, 3, 4, 5],
  "priority": "high"
}
```
### 2. Check Ingestion Status
GET /status/:ingestion_id

Check the current status of an ingestion operation using its ID.

Example
bash
Copy
Edit
curl https://<your-render-url>/status/abc123
Successful Response
json
Copy
Edit
```
{
  "ingestion_id": "abc123",
  "status": "triggered",
  "batches": [
    {
      "batch_id": "uuid1",
      "ids": [1, 2, 3],
      "status": "triggered"
    },
    {
      "batch_id": "uuid2",
      "ids": [4, 5],
      "status": "yet_to_start"
    }
  ]
}
```
### 🧪 Local Development
1. Clone the Repository
bash
Copy
Edit
```
git clone https://github.com/Raghav548/ingestion-api-loopai.git
cd ingestion-api-loopai
```
3. Install Dependencies
bash
Copy
Edit
```
npm install
```
5. Start the Server
bash
Copy
Edit
```
npm start
```
By default, it runs on: http://localhost:5000

### 🌐 Deployment (Render)
Steps:
Create an account on Render.

Create a new Web Service.

Connect your GitHub repo.

Use the following settings:

Root Directory: ingestion-api (if you named your folder this way)

Build Command: npm install

Start Command: npm start

Environment: Node

After deployment, use the provided URL as your base for API requests.

📂 Project Structure
pgsql
Copy
Edit
```
ingestion-api/
├── routes/
│   └── ingest.js
├── queue/
│   └── processor.js
├── utils/
│   └── chunkArray.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```
### 🔍 Sample Flow
Send ingestion request with a list of IDs and a priority.

The system chunks the IDs into batches of 3 and pushes them into a queue.

A background processor picks batches in order of priority and processes them.

Clients can poll /status/:ingestion_id to track the progress of all batches.

### ✅ Status Possibilities
yet_to_start: Batch is in queue but not started.

triggered: Batch is currently being processed.

completed: Batch processing is finished.
