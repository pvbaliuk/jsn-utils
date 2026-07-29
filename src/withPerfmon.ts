type AnyFn = (...args: any[]) => any;

export type PerfmonResult<T> = [execTime: number, result: T];
export type WithPerfmonReturn<F extends AnyFn> = ReturnType<F> extends Promise<any>
    ? Promise<PerfmonResult<Awaited<ReturnType<F>>>>
    : PerfmonResult<ReturnType<F>>;

export class PerfmonError extends Error{

    public readonly execTime: number;
    public readonly error: unknown;

    /**
     * @param {number} execTime
     * @param error
     */
    public constructor(execTime: number, error: unknown) {
        super();

        this.name = 'PerfmonError';
        this.execTime = execTime;
        this.error = error;
    }

}

/**
 * @template {AnyFn} F
 * @param {F} fn
 * @param {any} [args]
 * @return {WithPerfmonReturn<F>}
 */
export const withPerfmon = <F extends AnyFn>(
    fn: F,
    ...args: Parameters<F>
): WithPerfmonReturn<F> => {
    const startTime = performance.now();
    try{
        const promiseMaybe = fn(...args);
        if(promiseMaybe instanceof Promise)
            return promiseMaybe.then(
                res => [performance.now() - startTime, res] as PerfmonResult<any>,
                e => {throw new PerfmonError(performance.now() - startTime, e);}
            ) as any;

        return [performance.now() - startTime, promiseMaybe] as any;
    }catch(e){
        throw new PerfmonError(performance.now() - startTime, e);
    }
}
