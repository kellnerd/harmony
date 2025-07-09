import type { RawNode } from '../../index.js';
import ShareEntityServiceEndpoint from './ShareEntityServiceEndpoint.js';
export default class ShareEntityEndpoint extends ShareEntityServiceEndpoint {
    static type: string;
    constructor(data: RawNode);
}
