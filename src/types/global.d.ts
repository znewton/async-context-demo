/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { ITimeoutContext } from '../utils';
import { ITelemetryContext } from '../utils';

/* eslint-disable no-var */
declare module globalThis {
  var telemetryContext: ITelemetryContext | undefined;
  var timeoutContext: ITimeoutContext | undefined;
}
