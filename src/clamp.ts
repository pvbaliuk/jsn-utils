/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (num: number, min: number, max: number): number =>
    Math.min(Math.max(num, min), max);
