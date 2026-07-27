import {Monitor, wait} from '../src';

describe('Monitor', () => {

    let monitor: Monitor;

    beforeEach(() => {
        jest.useFakeTimers();
        monitor = new Monitor();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    describe('static measureFunctionTime()', () => {
        it('correctly measures time for sync function', () => {
            const fn = jest.fn(() => 'test');
            const time = Monitor.measureFunctionTime(fn);

            expect(fn).toHaveBeenCalledTimes(1);
            expect(time).toBeLessThanOrEqual(2);
        });

        it('correctly measures time for async function', async () => {
            const fn = jest.fn(async () => 'test');
            const promise = Monitor.measureFunctionTime(fn);

            expect(fn).toHaveBeenCalledTimes(1);
            expect(promise).toBeInstanceOf(Promise);
            await expect(promise).resolves.toBeLessThanOrEqual(2);
        });

        it('correctly measures time for a long-working async function', async () => {
            const fn = jest.fn(() => wait(1000));
            const promise = Monitor.measureFunctionTime(fn);

            expect(fn).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(1000);
            await expect(promise).resolves.toBeLessThanOrEqual(1002);
        });
    });

    describe('static autoStart()', () => {
        const result = Monitor.autoStart('test-label');

        expect(result).toBeInstanceOf(Monitor);
        expect(result['marks'].size).toBe(1);
        expect(result['marks'].get('test-label')).toBeInstanceOf(Array);
        expect(result['marks'].get('test-label')!).toHaveLength(1);
    });

    describe('main functionality', () => {
        let mock$map: Map<string, [number, string?]>;

        beforeEach(() => {
            mock$map = new Map();
            mock$map.set = jest.fn(mock$map.set.bind(mock$map));
            mock$map.get = jest.fn(mock$map.get.bind(mock$map));
            mock$map.has = jest.fn(mock$map.has.bind(mock$map));
            mock$map.delete = jest.fn(mock$map.delete.bind(mock$map));
            //@ts-ignore
            monitor['marks'] = mock$map;
        });

        it('start() calls Map.set for new label', () => {
            monitor.start('test-label');

            expect(mock$map.has).toHaveBeenCalledWith('test-label');
            expect(mock$map.set).toHaveBeenCalledWith('test-label', expect.any(Array));
        });

        it('start() do not call Map.set for existing label', () => {
            monitor.start('test-label');

            expect(mock$map.has).toHaveBeenCalledWith('test-label');
            expect(mock$map.set).toHaveBeenCalledWith('test-label', expect.any(Array));
            expect(mock$map.set).toHaveBeenCalledTimes(1);

            monitor.start('test-label');

            expect(mock$map.set).toHaveBeenCalledTimes(1);
        });

        it('mark() adds new mark to the marks list', () => {
            monitor.start('test-label');

            expect(mock$map.get('test-label')).toBeInstanceOf(Array);
            expect(mock$map.get('test-label')).toHaveLength(1);

            monitor.mark('test-label');

            expect(mock$map.get('test-label')).toHaveLength(2);
        });

        it('mark() throw TypeError for not existing label', () => {
            monitor.start('test-label');

            expect(() => monitor.mark('not-existing-label')).toThrow(TypeError);
        });

        it('stop() removes marks from the map', () => {
            monitor.start('test-label');

            expect(mock$map.get('test-label')).toBeInstanceOf(Array);
            expect(mock$map.get('test-label')).toHaveLength(1);

            monitor.stop('test-label');

            expect(mock$map.delete).toHaveBeenCalledWith('test-label');
            expect(mock$map.get('test-label')).toBeUndefined();
        });

        it('stop() returns correct MonitorResult object', () => {
            monitor.start('test-label');
            jest.advanceTimersByTime(50);
            monitor.mark('test-label');
            jest.advanceTimersByTime(50);
            const result = monitor.stop('test-label');

            expect(result).toBeDefined();
            expect(result).toEqual({
                marks: expect.any(Array),
                startTs: expect.any(Number),
                stopTs: expect.any(Number),
                totalTime: expect.any(Number)
            });

            expect(result.marks).toHaveLength(1);
        });

        it('stop() throw TypeError for not existing label', () => {
            monitor.start('test-label');

            expect(() => monitor.stop('not-existing-label')).toThrow(TypeError);
        });
    });

});
