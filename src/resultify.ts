export type ErrorResult<R, E> = readonly [R, null] | readonly [null, E];

/**
 * Executes a function and returns its result as a tuple `[value, error]`.
 * Works with both sync and async functions. Never throws.
 *
 * @template {() => any} F
 * @template {Error} E
 * @param {F} fn
 */
export function resultify<F extends () => any, E = Error>(
    fn: F
): ReturnType<F> extends Promise<infer R> ? Promise<ErrorResult<R, E>> : ErrorResult<ReturnType<F>, E> {
    try {
        const promiseOrResult = fn();
        if (promiseOrResult instanceof Promise) {
            return promiseOrResult.then(res => [res, null] as const).catch(err => [null, err as E] as const) as any;
        }

        return [promiseOrResult, null] as const as any;
    } catch (e) {
        return [null, e as E] as const as any;
    }
}
