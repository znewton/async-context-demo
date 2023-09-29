/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { AsyncLocalStorage } from 'node:async_hooks';

export class AsyncLocalStorageContextProvider<T> {
  private readonly asyncLocalStorage = new AsyncLocalStorage<T>();

  /**
   * Bind new properties to the asynchronous context.
   * If properties are a key-value record, new entries will be appended to the existing record.
   * Otherwise, the old context will be overwritten with the new context.
   */
  public bindContext(props: T, callback: () => void): void {
    // Extend existing properties if props are a key-value record.
    // Otherwise, overwrite existing props with new props.
    const existingProps = this.getContext();
    const newProperties: T =
      typeof props === 'object' && !Array.isArray(props)
        ? { ...existingProps, ...props }
        : props;
    // Anything within callback context will have access to properties.
    this.asyncLocalStorage.run(newProperties, () => callback());
  }

  /**
   * Get any properties bound to the asynchronous context.
   */
  public getContext(): T | undefined {
    return this.asyncLocalStorage.getStore();
  }
}
