/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { globalThis } from '../types/global';

export enum BaseTelemetryProperties {
  tenantId = 'tenantId',
  documentId = 'documentId',
  correlationId = 'correlationId',
}

export interface ITelemetryContextProperties {
  [BaseTelemetryProperties.tenantId]: string;
  [BaseTelemetryProperties.documentId]: string;
  [BaseTelemetryProperties.correlationId]: string;
}

export interface ITelemetryContext {
  /**
   * Bind properties to context where `callback()` is executed.
   * After this, `getProperties()` within `callback` will include `props`.
   */
  bindProperties(
    props: Partial<ITelemetryContextProperties>,
    callback: () => void
  ): void;
  /**
   * Promisified {@link ITelemetryContext.bindProperties}.
   */
  bindPropertiesAsync<T>(
    props: Partial<ITelemetryContextProperties>,
    callback: () => Promise<T>
  ): Promise<T>;
  /**
   * Retrieve contextual properties for telemetry.
   */
  getProperties(): Partial<ITelemetryContextProperties>;
}

export class NullTelemetryContext implements ITelemetryContext {
  public getProperties(): Partial<ITelemetryContextProperties> {
    return {};
  }

  public bindProperties(
    props: Partial<ITelemetryContextProperties>,
    callback: () => void
  ): void {
    callback();
  }

  public async bindPropertiesAsync<T>(
    props: Partial<ITelemetryContextProperties>,
    callback: () => Promise<T>
  ): Promise<T> {
    return callback();
  }
}
const nullTelemetryContext = new NullTelemetryContext();

const _global = global as unknown as typeof globalThis;

export const getGlobalTelemetryContext = () =>
  (_global.telemetryContext as ITelemetryContext | undefined) ??
  nullTelemetryContext;

export const setGlobalTelemetryContext = (
  telemetryContext: ITelemetryContext
) => {
  _global.telemetryContext = telemetryContext;
};
