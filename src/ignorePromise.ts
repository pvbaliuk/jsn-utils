import {noop} from './noop';

/**
 * Accepts a promise and ensures that its resolution or rejection is ignored.
 *
 * @param {Promise<any>} promise - The promise to be ignored.
 */
export const ignorePromise = (promise: Promise<any>): void => {
    promise
        .then(noop)
        .catch(noop);
}
