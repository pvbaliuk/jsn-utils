import {chunkStr} from '../src';

describe('chunkStr', () => {
    it('returns an empty array if string is empty', () => {
        expect(chunkStr('', 5)).toHaveLength(0);
    });

    it('returns one chunk when string length equals or less than specified chunk size', () => {
        expect(chunkStr('ab', 2)).toEqual(['ab']);
    });

    it('splits string into chunks of given size correctly', () => {
        expect(chunkStr('abcdef', 2)).toEqual(['ab', 'cd', 'ef']);
    });

    it('handles remainder elements correctly', () => {
        expect(chunkStr('abcdef1', 2)).toEqual(['ab', 'cd', 'ef', '1']);
    });

    it('throws if chunk size is 0 or negative', () => {
        expect(() => chunkStr('abcd', 0)).toThrow(TypeError);
        expect(() => chunkStr('abcd', -1)).toThrow(TypeError);
    });
});
