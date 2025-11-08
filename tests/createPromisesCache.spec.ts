import {createPromisesCache} from '../src';
import * as createInFlightDeduper_module from '../src/createInFlightDeduper';

describe('createPromisesCache', () => {
    it('internally calls createInFlightDeduper', () => {
        const spy = jest.spyOn(createInFlightDeduper_module, 'createInFlightDeduper');

        createPromisesCache();
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockRestore();
    });
});
