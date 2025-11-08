import {isObjectEmpty} from '../src';

describe('isObjectEmpty', () => {
    it('returns true for an empty object literal', () => {
        expect(isObjectEmpty({})).toBe(true);
    });

    it('returns false for an object with one property', () => {
        expect(isObjectEmpty({a: 1})).toBe(false);
    });

    it('returns false for an object with multiple properties', () => {
        expect(isObjectEmpty({a: 1, b: 2, c: 3})).toBe(false);
    });

    it('returns true for an object with only inherited properties', () => {
        const obj = Object.create({inherited: 123});
        expect(isObjectEmpty(obj)).toBe(true);
    });

    it('returns false for an object with both own and inherited properties', () => {
        const obj = Object.create({inherited: 123});
        obj.own = 'hello';

        expect(isObjectEmpty(obj)).toBe(false);
    });

    it('uses length property for arrays (optimized path)', () => {
        expect(isObjectEmpty([1, 2, 3])).toBe(false);
        expect(isObjectEmpty([])).toBe(true);
    });

    it('handles objects without prototype', () => {
        const obj = Object.create(null);
        expect(isObjectEmpty(obj)).toBe(true);
        obj.own = 'hello';
        expect(isObjectEmpty(obj)).toBe(false);
    });
});
