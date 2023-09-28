/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { globalThis } from '../types/global';

export interface ITimeoutContext {
  /**
   * Attaches timeout info to the callback context.
   */
  bindTimeout(maxDurationMs: number, callback: () => void): void;
  /**
   * Attaches timeout info to the callback context.
   * Returns callback result as a promise.
   */
  bindTimeoutAsync<T>(
    maxDurationMs: number,
    callback: () => Promise<T>
  ): Promise<T>;
  /**
   * Checks if the timeout has been exceeded.
   * If exceeded, throws a 503 Timeout error
   */
  checkTimeout(): void;
}

/**
 * Empty ITimeoutContext that binds nothing never throws.
 * Callbacks are still executed and returned.
 */
class NullTimeoutContext implements ITimeoutContext {
  bindTimeout(maxDurationMs: number, callback: () => void): void {
    callback();
  }

  async bindTimeoutAsync<T>(
    maxDurationMs: number,
    callback: () => Promise<T>
  ): Promise<T> {
    return callback();
  }

  checkTimeout(): void {}
}
const nullTimeoutContext = new NullTimeoutContext();

const _global = global as unknown as typeof globalThis;

export const getGlobalTimeoutContext = () =>
  (_global.timeoutContext as ITimeoutContext | undefined) ?? nullTimeoutContext;

export const setGlobalTimeoutContext = (timeoutContext: ITimeoutContext) => {
  _global.timeoutContext = timeoutContext;
};
