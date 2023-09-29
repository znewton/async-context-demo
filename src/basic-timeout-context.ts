/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import express from 'express';
import fetch from 'node-fetch';
import {
  bindTimeoutContext,
  setGlobalTimeoutContext,
  getGlobalTimeoutContext,
  AsyncLocalStorageTimeoutContext,
} from './utils';

setGlobalTimeoutContext(new AsyncLocalStorageTimeoutContext());

const timeoutDuration: number = 500;
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simple server
const app: express.Express = express();
app.use(bindTimeoutContext(timeoutDuration));
app.get('/api', async (req, res) => {
  await delay(timeoutDuration * 2);
  try {
    getGlobalTimeoutContext().checkTimeout();
  } catch (e) {
    res.status(503).json({ msg: (e as Error).message });
    return;
  }
  res.json({ msg: 'Hello World!' });
});
const server = app.listen(3000, () => console.log('Listening on port 3000'));

// Simple client
fetch('http://localhost:3000/api')
  .then((res) => {
    console.log('Api Response Received', {
      status: res.status,
    });
    return res.json();
  })
  .then((json) => console.log('Api Response Parsed', json))
  .finally(() => {
    // Close the server to end the script.
    server.close();
    process.exit(0);
  });

// Expected output:
// Listening on port 3000
// [TimeoutContext] telemetry...
// Api Response Received { status: 503 }
// Api Response Parsed { msg: '503 Timeout' }
