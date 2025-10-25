export type ErrorResult<R, E = Error> = readonly [R, null] | readonly [null, E];

export function resultify<E = Error, R = any>(fn: () => R): ErrorResult<R, E>;
export function resultify<E = Error, R = any>(fn: () => Promise<R>): Promise<ErrorResult<R, E>>;
/**
 * Executes a function and returns its result as a tuple `[value, error]`.
 * Works with both sync and async functions. Never throws.
 *
 * @template {Error} E
 * @template {any} R
 * @param {(() => R) | (() => Promise<R>)} fn
 * @returns {ErrorResult<R> | Promise<ErrorResult<R, E>>}
 */
export function resultify<E = Error, R = any>(
    fn: () => R | Promise<R>
): ErrorResult<R, E> | Promise<ErrorResult<R, E>> {
    try {
        const promiseOrResult = fn();
        if (promiseOrResult instanceof Promise) {
            return (promiseOrResult as Promise<R>)
                .then(res => [res as R, null] as const)
                .catch(err => [null, err as E] as const);
        }

        return [promiseOrResult as R, null] as const;
    } catch (e) {
        return [null, e as E] as const;
    }
}
