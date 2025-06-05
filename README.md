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
