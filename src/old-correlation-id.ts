/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import express from 'express';
import fetch from 'node-fetch';
import {
  CorrelationIdHeaderName,
  bindCorrelationId,
  getCorrelationId,
  getCorrelationIdWithHttpFallback,
} from './utils';

// Simple server
const app: express.Express = express();
app.use(bindCorrelationId());
app.get('/api', (req, res) => {
  console.log('Api Request Received', { correlationId: getCorrelationId() });
  res.once('finish', () => {
    console.log('Api Response Sent', {
      correlationId: getCorrelationIdWithHttpFallback(req, res),
    });
  });
  res.json({ msg: 'Hello World!' });
});
const server = app.listen(3000, () => console.log('Listening on port 3000'));

// Simple client
fetch('http://localhost:3000/api')
  .then((res) => {
    console.log('Api Response Received', {
      status: res.status,
      correlationId: res.headers.get(CorrelationIdHeaderName),
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
// Api Request Received { correlationId: 'cc13da28-13d3-4c25-bbac-d22fdddcdf77' }
// Api Response Sent { correlationId: 'cc13da28-13d3-4c25-bbac-d22fdddcdf77' }
// Api Response Received { status: 200, correlationId: 'cc13da28-13d3-4c25-bbac-d22fdddcdf77' }
// Api Response Parsed { msg: 'Hello World!' }
