/**
 * Splits a string into chunks of a specified size
 *
 * @param {string} str - The string to be split into chunks
 * @param {number} chunkSize - The size of each chunk
 * @returns {string[]} An array containing the chunks
 */
export function chunkStr(str: string, chunkSize: number): string[]{
    return Array.from({length: Math.ceil(str.length / chunkSize)}, (_, i) =>
        str.slice(i * chunkSize, i * chunkSize + chunkSize)
    );
}
