type WrapFn<R = any> = () => R | Promise<R>;
type ErrorResult<R = any, E = Error> = readonly [R, null] | readonly [null, E];

export function resultify<E = Error, R = any>(fn: () => R): ErrorResult<R, E>;
export function resultify<E = Error, R = any>(fn: () => Promise<R>): Promise<ErrorResult<R, E>>;
/**
 * Executes a function and returns its result as a tuple `[value, error]`.
 * Works with both sync and async functions. Never throws.
 *
 * @template {Error} E
 * @template {any} R
 * @param {WrapFn<R>} fn
 * @returns {ErrorResult<R> |
 */
export function resultify<E = Error, R = any>(fn: WrapFn<R>): ErrorResult<R, E> | Promise<ErrorResult<R, E>> {
    try {
        const promiseOrResult = fn();
        if (promiseOrResult && typeof (promiseOrResult as any).then === 'function') {
            return (promiseOrResult as Promise<R>)
                .then(res => [res, null] as const)
                .catch(err => [null, err as E] as const);
        }

        return [promiseOrResult as R, null] as const;
    } catch (e) {
        return [null, e as E] as const;
    }
}
