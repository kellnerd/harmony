import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Factoid from './Factoid.js';
export default class ViewCountFactoid extends YTNode {
    static type: string;
    view_count_entity_key: string;
    factoid: Factoid | null;
    view_count_type: string;
    constructor(data: RawNode);
}
