/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

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

function add(a: number, b: number): number {
  const result = a + b;
  log(`${a} + ${b} = ${result}`);
  return result;
}

async function main() {
  const correlationId = '123abc';
  await getGlobalTelemetryContext().bindPropertiesAsync(
    { correlationId },
    async () => {
      const firstAddResult = add(1, 2);
      const secondAddResult = add(3, 4);
      const documentId = `document-${firstAddResult}-${secondAddResult}`;
      return getGlobalTelemetryContext().bindPropertiesAsync(
        { documentId },
        async () => {
          return add(firstAddResult, secondAddResult);
        }
      );
    }
  );
}

main()
  .then(() => {})
  .catch(() => {});
