import {PerfmonError, withPerfmon} from '../src';

describe('withPerfmon', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it('correctly measures time for sync function', () => {
        const fn = jest.fn(() => 'test');
        const result = withPerfmon(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toEqual([expect.any(Number), 'test']);
        expect(result[0]).toBeLessThanOrEqual(2);
    });

    it('correctly measures time for async function', async () => {
        const fn = jest.fn(() => new Promise(resolve => setTimeout(() => resolve('test'), 50)));
        const promise = withPerfmon(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(promise).toBeInstanceOf(Promise);

        jest.advanceTimersByTime(51);

        const result = await promise;
        expect(result).toEqual([expect.any(Number), 'test']);
        expect(result[0]).toBeGreaterThan(49);
        expect(result[0]).toBeLessThanOrEqual(52);
    });

    it('correctly wraps error for sync function', () => {
        const fn = jest.fn(() => {throw new Error('Test error');});
        expect(() => withPerfmon(fn)).toThrow(PerfmonError);

        try{
            withPerfmon(fn);
        }catch(e){
            expect((e as PerfmonError).error).toBeInstanceOf(Error);
            expect(((e as PerfmonError).error as Error).message).toBe('Test error');
        }
    });

    it('correctly wraps error for async function', async () => {
        const fn = jest.fn(async () => {throw new Error('Test error');})
        const promise = withPerfmon(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(promise).toBeInstanceOf(Promise);

        try{
            await promise;
        }catch(e){
            expect(e as PerfmonError).toBeInstanceOf(PerfmonError);
            expect(((e as PerfmonError).error as Error).message).toBe('Test error');
        }
    });
})
