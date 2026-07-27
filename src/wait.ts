/**
 * Waits asynchronously for the specified amount of milliseconds before resolving.
 *
 * @param {number} wait_ms - The number of milliseconds to wait. If less than 1, the promise resolves immediately.
 * @param {AbortSignal} [signal]
 * @returns {Promise<void>} A promise that resolves after the specified wait time.
 */
export const wait = (wait_ms: number, signal?: AbortSignal): Promise<void> => {
    if (wait_ms < 1) return Promise.resolve();
    if (!Number.isFinite(wait_ms) && !signal)
        throw new TypeError(
            'Invalid wait_ms: must be a finite number (or you should provide an AbortSignal as a second argument)'
        );
    if (signal?.aborted) return Promise.resolve();
    if (!signal) return new Promise<void>(resolve => setTimeout(resolve, wait_ms));

    return new Promise(resolve => {
        let timer_ref: ReturnType<typeof setTimeout> | null = null;
        const on_abort = (): void => {
            if (timer_ref) clearTimeout(timer_ref);
            resolve();
        };

        signal.addEventListener('abort', on_abort, { once: true });
        timer_ref = setTimeout(() => {
            signal.removeEventListener('abort', on_abort);
            resolve();
        }, wait_ms);
    });
};
