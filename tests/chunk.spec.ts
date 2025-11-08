import {chunk} from '../src';

describe('chunk', () => {
    it('returns an empty array when input is empty', () => {
        expect(chunk([], 5)).toHaveLength(0);
    });

    it('returns one chunk when array length equals or less than specified chunk size', () => {
        expect(chunk([1, 2], 2)).toEqual([[1, 2]]);
    });

    it('splits array into chunks of given size correctly', () => {
        expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    it('handles remainder elements correctly', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('throws if chunk size is 0 or negative', () => {
        expect(() => chunk([1, 2, 3, 4], 0)).toThrow(TypeError);
        expect(() => chunk([1, 2, 3, 4], -1)).toThrow(TypeError);
    });
});
