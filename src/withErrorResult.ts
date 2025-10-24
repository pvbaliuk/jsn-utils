type WrapFn<R = any> = () => R | Promise<R>;
type ErrorResult<R = any, E = Error> = [R, null] | [null, E];

/**
 * @template {any} R
 * @template {Error} E
 * @param {(() => any | Promise<any>)} fn
 * @returns {Promise<ErrorResult<R, E>>}
 */
export async function withErrorResult<E = Error, R = any>(fn: WrapFn<R>): Promise<ErrorResult<R, E>> {
    try {
        const r = await fn();
        return [r, null];
    } catch (e) {
        return [null, e as E];
    }
}
