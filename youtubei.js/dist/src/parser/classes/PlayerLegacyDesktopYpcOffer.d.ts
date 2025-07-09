import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class PlayerLegacyDesktopYpcOffer extends YTNode {
    static type: string;
    title: string;
    thumbnail: string;
    offer_description: string;
    offer_id: string;
    constructor(data: RawNode);
}
