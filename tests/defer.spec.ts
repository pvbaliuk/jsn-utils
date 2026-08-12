import {defer} from '../src';

describe('defer', () => {
    it('creates deferred promise', () => {
        const deferred = defer();

        expect(deferred).toHaveProperty('promise');
        expect(deferred).toHaveProperty('resolve');
        expect(deferred).toHaveProperty('reject');

        expect(deferred.promise).toBeInstanceOf(Promise);
        expect(typeof deferred.resolve).toBe('function');
        expect(typeof deferred.reject).toBe('function');
    });

    it('creates different deferred promises on every call', () => {
        const d1 = defer(),
            d2 = defer();

        expect(d2).not.toBe(d1);
        expect(d2.promise).not.toBe(d1.promise);
        expect(d2.resolve).not.toBe(d1.resolve);
        expect(d2.reject).not.toBe(d1.reject);
    });

    it('correctly resolves promise', async () => {
        const deferred = defer<'ok'>();

        deferred.resolve('ok');
        await expect(deferred.promise).resolves.toBe('ok');
    });

    it('correctly rejects promise', async () => {
        const deferred = defer();

        deferred.reject(new Error());
        await expect(deferred.promise).rejects.toBeInstanceOf(Error);
    });
});
