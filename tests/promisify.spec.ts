import {promisify} from '../src';

describe('promisify', () => {
    it('should turn synchronous function into promise', async () => {
        const fn = jest.fn(() => 'ok' as const);
        const promise = promisify(fn);

        expect(promise).toBeInstanceOf(Promise);
    });

    it('should wrap asynchronous function into promise', async () => {
        const fn = jest.fn().mockResolvedValue('ok' as const);
        const initialPromise = fn();
        const wrappedPromise = promisify(fn);

        expect(initialPromise).toBeInstanceOf(Promise);
        expect(wrappedPromise).toBeInstanceOf(Promise);
        expect(wrappedPromise).not.toBe(initialPromise);

        const result = await wrappedPromise;
        expect(result).toBe('ok');
    });

    it('should return value from synchronous function', async () => {
        const fn = jest.fn(() => 'ok' as const);
        const result = await promisify(fn);

        expect(result).toBe('ok');
    });

    it('should return value from asynchronous function', async () => {
        const fn = jest.fn().mockResolvedValue('ok' as const);
        const result = await promisify(fn);

        expect(result).toBe('ok');
    });

    it('should re-throw from synchronous function', async () => {
        const fn = jest.fn(() => {throw new Error();});
        await expect(promisify(fn)).rejects.toThrow();
    });
});
