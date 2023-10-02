/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import EventEmitter from 'events';
import {
  AsyncLocalStorageTelemetryContext,
  getGlobalTelemetryContext,
  setGlobalTelemetryContext,
} from './utils';

const telemetryContext = new AsyncLocalStorageTelemetryContext();
setGlobalTelemetryContext(telemetryContext);

function log(msg: string) {
  const telemetryProperties = getGlobalTelemetryContext().getProperties();
  console.log(msg, { ...telemetryProperties });
}

class ExampleEventEmitter extends EventEmitter {
  constructor() {
    super();
  }

  emitEvent() {
    this.emit('event');
  }
}

async function main() {
  const correlationId = '123abc';
  const eventEmitter = new ExampleEventEmitter();
  eventEmitter.on('event', () => {
    log('event received');
  });
  eventEmitter.emitEvent();
  await getGlobalTelemetryContext().bindPropertiesAsync(
    { correlationId },
    async () => {
      eventEmitter.emitEvent();
      const documentId = `document-${1}`;
      return getGlobalTelemetryContext().bindPropertiesAsync(
        { documentId },
        async () => {
          eventEmitter.emitEvent();
        }
      );
    }
  );
}

main()
  .then(() => {})
  .catch(() => {});
