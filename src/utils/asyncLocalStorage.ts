/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import type { Request, Response, RequestHandler } from 'express';
import { v4 as uuid } from 'uuid';

export const CorrelationIdHeaderName = 'x-correlation-id';

/**
 * AsyncLocalStorage instance used to track correlationIds.
 */
const asyncLocalStorage = new AsyncLocalStorage<string>();

/**
 * Retrieves the correlationId from the current context.
 */
export function getCorrelationId(): string | undefined {
  return asyncLocalStorage.getStore();
}

/**
 * Retrieves the correlationId from the current context,
 * or from the request/response headers if not found in context.
 */
export function getCorrelationIdWithHttpFallback(
  req: Request,
  res: Response
): string | undefined {
  return (
    getCorrelationId() ??
    req.get(CorrelationIdHeaderName) ??
    res.get(CorrelationIdHeaderName)
  );
}

/**
 * Binds correlationId to the context of the current request.
 */
export function bindCorrelationId(): RequestHandler {
  return (req, res, next): void => {
    const id: string = req.header(CorrelationIdHeaderName) ?? uuid();
    res.setHeader(CorrelationIdHeaderName, id);
    asyncLocalStorage.run(id, () => next());
  };
}
