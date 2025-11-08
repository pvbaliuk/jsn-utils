import {resultify} from '../src';

describe('resultify', () => {
    it('should return [value, null] for synchronous success', () => {
        const fn = jest.fn(() => 'ok' as const);
        const result = resultify(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toEqual(['ok', null]);
    });

    it('should return [null, error] for synchronous throw', () => {
        const error = new Error();
        const fn = jest.fn(() => {throw error; return 'ok' as const;});
        const result = resultify(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toEqual([null, error]);
    });

    it('should return [value, null] for async success', async () => {
        const fn = jest.fn(async () => 'ok' as const);
        const result = await resultify(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toEqual(['ok', null]);
    });

    it('should return [null, error] for async async rejection', async () => {
        const error = new Error();
        const fn = jest.fn(async () => {throw error; return 'ok' as const;});
        const result = await resultify(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toEqual([null, error]);
    });

    it('should handle functions returning a promise that rejects immediately', async () => {
        const error = new Error();
        const fn = jest.fn(() => Promise.reject(error));
        const result = await resultify(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toEqual([null, error]);
    });
});
