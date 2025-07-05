import type { RawNode } from '../index.js';
import MetadataBadge from './MetadataBadge.js';
import Thumbnail from './misc/Thumbnail.js';
export default class LiveChatAuthorBadge extends MetadataBadge {
    static type: string;
    custom_thumbnail: Thumbnail[];
    constructor(data: RawNode);
}
