import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ThumbnailView from './ThumbnailView.js';
import CollectionThumbnailView from './CollectionThumbnailView.js';
import LockupMetadataView from './LockupMetadataView.js';
import RendererContext from './misc/RendererContext.js';
export default class LockupView extends YTNode {
    static type: string;
    content_image: CollectionThumbnailView | ThumbnailView | null;
    metadata: LockupMetadataView | null;
    content_id: string;
    content_type: 'UNSPECIFIED' | 'VIDEO' | 'PLAYLIST' | 'SHORT' | 'CHANNEL' | 'ALBUM' | 'PRODUCT' | 'GAME' | 'CLIP' | 'PODCAST' | 'SOURCE' | 'SHOPPING_COLLECTION' | 'MOVIE';
    renderer_context: RendererContext;
    constructor(data: RawNode);
}
