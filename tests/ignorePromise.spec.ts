import {ignorePromise} from '../src';
import * as noop_module from '../src/noop';

describe('ignorePromise', () => {
    beforeEach(() => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('does not throw for a resolving promise', async () => {
        const promise = Promise.resolve(1);
        expect(() => ignorePromise(promise)).not.toThrow();
        await promise;
    });

    it('does not throw for a rejecting promise', async () => {
        const promise = Promise.reject(new Error('test'));
        expect(() => ignorePromise(promise)).not.toThrow();
        try{
            await promise.catch(() => {});
        }catch(e){}
    });

    it('calls noop on resolution', async () => {
        const promise = Promise.resolve('ok');
        const spy = jest.spyOn(noop_module, 'noop');

        ignorePromise(promise);

        await promise;
        expect(spy).toHaveBeenCalledWith('ok');
        spy.mockRestore();
    });

    it('calls noop on rejection', async () => {
        const promise = Promise.reject('error');
        const spy = jest.spyOn(noop_module, 'noop');

        ignorePromise(promise);

        await promise.catch(() => {});
        expect(spy).toHaveBeenCalledWith('error');
        spy.mockRestore();
    });
});
