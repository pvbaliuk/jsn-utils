type CreatePromisesCacheResult = {
    create: <R extends any = any>(key: string, fn: () => Promise<R>) => Promise<R>;
};

/**
 * @returns {CreatePromisesCacheResult}
 */
export function createPromisesCache(): CreatePromisesCacheResult{
    const __promises = new Map<string, Promise<any>>();

    return {
        create: function<R extends any = any>(key: string, fn: () => R|Promise<R>): Promise<R>{
            let promise = __promises.get(key);
            if(promise)
                return promise;

            promise = new Promise<R>((resolve, reject) => {
                try{
                    const resultOrPromise = fn();
                    if(resultOrPromise instanceof Promise)
                        return resultOrPromise
                            .then(resolve)
                            .catch(reject);

                    return resolve(resultOrPromise);
                }catch(e){
                    reject(e);
                }
            });

            promise.finally(() => {__promises.delete(key);});
            __promises.set(key, promise);
            return promise;
        }
    };
}
