/**
 * Splits an array into smaller arrays of a specified size.
 *
 * @template T
 * @param {T[]} arr - The array to be split into chunks.
 * @param {number} chunk_size - The size of each chunk.
 * @returns {T[][]} An array containing the chunks.
 */
export const chunk = <T extends any>(arr: T[], chunk_size: number): T[][] => {
    if(chunk_size <= 0)
        throw new TypeError('Chunk size should be greater than 0');

    return Array.from({
        length: Math.ceil(arr.length / chunk_size)},
        (_, i) => arr.slice(i * chunk_size, i * chunk_size + chunk_size)
    );
}
