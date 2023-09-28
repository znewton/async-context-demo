/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
// basic-async-context.ts
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<string>();

function log(msg: string) {
  const correlationId = asyncLocalStorage.getStore();
  console.log(msg, { correlationId });
}

function add(a: number, b: number): number {
  const result = a + b;
  log(`${a} + ${b} = ${result}`);
  return result;
}

function main() {
  const correlationId = '123abc';
  add(1, 2);
  asyncLocalStorage.run(correlationId, () => {
    add(3, 4);
  });
  add(5, 6);
}

main();
// Outputs:
// 1 + 2 = 3, { correlationId: undefined }
// 3 + 4 = 7, { correlationId: '123abc' }
// 5 + 6 = 11, { correlationId: undefined }
