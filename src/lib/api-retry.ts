import { delay } from './utils';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
};

/**
 * Execute an async function with exponential backoff retry
 * Per FR-036: auto-retry 3x with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | undefined;
  let currentDelay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this was the last attempt, don't wait
      if (attempt === opts.maxRetries) {
        break;
      }

      // Wait with exponential backoff
      await delay(currentDelay);

      // Calculate next delay with backoff
      currentDelay = Math.min(currentDelay * opts.backoffFactor, opts.maxDelay);
    }
  }

  throw lastError;
}

/**
 * Fetch with retry - convenience wrapper around fetch with retry logic
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, options);

    // Only retry on server errors (5xx) or network errors
    if (response.status >= 500) {
      throw new Error(`Server error: ${response.status}`);
    }

    return response;
  }, retryOptions);
}

/**
 * Create an optimistic update handler
 * Executes optimistic update immediately, then performs the actual update
 * Reverts on failure
 */
export function createOptimisticUpdate<T, R>(
  optimisticFn: () => T,
  asyncFn: () => Promise<R>,
  revertFn: (previousState: T) => void
): Promise<R> {
  const previousState = optimisticFn();

  return asyncFn().catch((error) => {
    revertFn(previousState);
    throw error;
  });
}
