import {createInFlightDeduper} from './createInFlightDeduper';

type CreatePromisesCacheResult = {
    create: <R extends any = any>(key: string, fn: () => R|Promise<R>) => Promise<R>;
};

/**
 * @deprecated This function will be removed in the next major version of the library. Use <b>createInFlightDeduper</b> instead
 * @returns {CreatePromisesCacheResult}
 */
export function createPromisesCache(): CreatePromisesCacheResult{
    return createInFlightDeduper();
}
