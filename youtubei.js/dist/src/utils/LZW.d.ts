/**
 * Compresses a string using the LZW compression algorithm.
 * @param input - The data to compress.
 */
export declare function compress(input: string): string;
/**
 * Decompresses data that was compressed using the LZW compression algorithm.
 * @param input - The data to be decompressed.
 */
export declare function decompress(input: string): string;
