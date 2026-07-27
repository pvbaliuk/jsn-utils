import {createInFlightDeduper, type InFlightDeduper, wait} from '../src';

describe('createInFlightDeduper', () => {
    let deduper: InFlightDeduper;

    beforeEach(() => {
        jest.useFakeTimers();
        deduper = createInFlightDeduper();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('executes function and returns its result', async () => {
        const fn = jest.fn(() => 'test');
        const result = await deduper.use('testFn', fn);
        expect(result).toBe('test');
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('deduplicates in-flight promises', async () => {
        const fn = jest.fn(async () => {
            await wait(100);
            return 'done';
        });

        const p1 = deduper.use('task-1', fn);
        jest.advanceTimersByTime(99);
        const p2 = deduper.use('task-1', fn);
        expect(p1).toBe(p2);

        jest.advanceTimersByTime(1);
        const r1 = await p1,
            r2 = await p2;

        expect(r1).toBe('done');
        expect(r1).toBe(r2);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('allows new execution after previous promise settles', async () => {
        const fn = jest.fn(async () => 'done');

        await deduper.use('task-1', fn);
        await deduper.use('task-1', fn);

        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('works with synchronous functions', async () => {
        const fn = jest.fn(() => 'sync');
        const result = await deduper.use('task-1', fn);
        expect(result).toBe('sync');
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('clears promise after rejection and allows retry', async () => {
        const errFn = jest.fn(async () => {throw new Error('test error')}),
            successFn = jest.fn(async () => 'done');

        await expect(deduper.use('task-1', errFn)).rejects.toThrow();
        const promise = deduper.use('task-1', successFn);

        await expect(promise).resolves.toBe('done');
    });
});
