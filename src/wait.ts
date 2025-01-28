/**
 * Waits asynchronously for the specified amount of milliseconds before resolving.
 *
 * @param {number} wait_ms - The number of milliseconds to wait. If less than 1, the promise resolves immediately.
 * @returns {Promise<void>} A promise that resolves after the specified wait time.
 */
export const wait = async (wait_ms: number): Promise<void> => {
    if(wait_ms < 1)
        return Promise.resolve();

    return new Promise(resolve => setTimeout(resolve, wait_ms));
};
