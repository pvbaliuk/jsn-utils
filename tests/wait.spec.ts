import {wait} from '../src';

describe('wait', () => {
    let ctrl: AbortController = undefined!,
        signal: AbortSignal = undefined!,
        spy$addEventListener: jest.SpyInstance,
        spy$removeEventListener: jest.SpyInstance;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        jest.spyOn(global, 'clearTimeout');

        ctrl = new AbortController();
        signal = ctrl.signal;
        spy$addEventListener = jest.spyOn(signal, 'addEventListener');
        spy$removeEventListener = jest.spyOn(signal, 'removeEventListener');
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it('removes abort listener after timeout resolves', async () => {
        const promise = wait(100, signal);

        jest.advanceTimersByTime(100);

        await expect(promise).resolves.toBeUndefined();
        expect(spy$addEventListener).toHaveBeenCalledTimes(1);
        expect(spy$removeEventListener).toHaveBeenCalledTimes(1);
    });

    it('resolves immediately if wait_ms < 1', async () => {
        const promise = wait(0);
        await expect(promise).resolves.toBeUndefined();
        expect(setTimeout).not.toHaveBeenCalled();
    });

    it('resolves after specified delay', async () => {
        const promise = wait(100);

        let resolved = false;
        promise.then(() => (resolved = true));
        expect(resolved).toBe(false);

        jest.advanceTimersByTime(100);
        await expect(promise).resolves.toBeUndefined();
        expect(resolved).toBe(true);
    });

    it('resolves immediately if signal is already aborted', async () => {
        ctrl.abort();
        const promise = wait(100, signal);

        await expect(promise).resolves.toBeUndefined();
        expect(setTimeout).not.toHaveBeenCalled();
    });

    it('resolves early if aborted before timeout', async () => {
        const promise = wait(100, signal);

        let resolved = false;
        promise.then(() => (resolved = true));
        expect(resolved).toBe(false);

        jest.advanceTimersByTime(50);

        expect(resolved).toBe(false);
        ctrl.abort();

        await expect(promise).resolves.toBeUndefined();
        expect(resolved).toBe(true);
        expect(clearTimeout).toHaveBeenCalled();
    });

    it('resolves after timeout if not aborted', async () => {
        const promise = wait(100, signal);

        jest.advanceTimersByTime(100);
        await expect(promise).resolves.toBeUndefined();
    });

    it('throw TypeError for non-finite wait_ms without signal', () => {
        expect(() => wait(Infinity)).toThrow(TypeError);
        expect(() => wait(NaN)).toThrow(TypeError);
    });
});
