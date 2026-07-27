import {noop} from './noop';

type DescribedPromise<T extends any> = [Promise<T>, string];

type AwaitedTuple<T extends (Promise<any>|DescribedPromise<any>)[]> = {
    [K in keyof T]: T[K] extends DescribedPromise<any>
        ? PromiseSettledResult<Awaited<T[K][0]>>
        : T[K] extends Promise<any>
            ? PromiseSettledResult<Awaited<T[K]>>
            : never;
}

type ErrorDetails = {reason: unknown; message?: string;}

type ErrorCallback = (details: ErrorDetails, index: number) => void;

export const trySettlePromises = async <
    T extends (Promise<any>|DescribedPromise<any>)[]
>(
    promises: [...T],
    onError?: ErrorCallback
): Promise<AwaitedTuple<T>> => {
    onError = onError && typeof onError === 'function'
        ? onError
        : noop;

    const results = await Promise.allSettled(promises.map(v => Array.isArray(v) ? v[0] : v));
    for(let i = 0; i < results.length; i++){
        const res = results[i];
        const entry = promises[i];
        if(res.status === 'rejected'){
            try{
                onError({
                    reason: res.reason,
                    message: Array.isArray(entry) ? entry[1] : undefined
                }, i);
            }catch(e){}
        }
    }

    return results as any;
}
