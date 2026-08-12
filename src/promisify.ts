/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {any} args
 * @returns {Promise<Awaited<ReturnType<F>>>}
 */
export const promisify = <
    F extends (...args: any[]) => any
>(fn: F, ...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> => {
    return new Promise<Awaited<ReturnType<F>>>((resolve, reject) => {
        try{
            const promiseMaybe = fn(...args);
            if(promiseMaybe instanceof Promise){
                promiseMaybe.then(resolve).catch(reject);
            }else{
                resolve(promiseMaybe);
            }
        }catch(e){
            reject(e);
        }
    });
}
