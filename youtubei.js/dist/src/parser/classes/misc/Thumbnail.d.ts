import type { RawNode } from '../../index.js';
export default class Thumbnail {
    url: string;
    width: number;
    height: number;
    constructor(data: RawNode);
    /**
     * Get thumbnails from response object.
     */
    static fromResponse(data: any): Thumbnail[];
}
