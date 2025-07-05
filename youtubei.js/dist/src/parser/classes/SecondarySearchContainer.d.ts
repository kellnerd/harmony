import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
import UniversalWatchCard from './UniversalWatchCard.js';
export default class SecondarySearchContainer extends YTNode {
    static type: string;
    target_id?: string;
    contents: ObservedArray<UniversalWatchCard>;
    constructor(data: RawNode);
}
