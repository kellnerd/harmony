import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Factoid from './Factoid.js';
export default class UploadTimeFactoid extends YTNode {
    static type: string;
    factoid: Factoid | null;
    constructor(data: RawNode);
}
