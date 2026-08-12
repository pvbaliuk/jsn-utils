export type DeferredPromise<T> = {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
}

/**
 * @template T
 * @returns {DeferredPromise<T>}
 */
export const defer = <T>(): DeferredPromise<T> => {
    let resolve!: (value: T) => void,
        reject!: (reason?: any) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {promise, resolve, reject};
}
