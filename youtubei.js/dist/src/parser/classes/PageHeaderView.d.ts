import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ContentMetadataView from './ContentMetadataView.js';
import ContentPreviewImageView from './ContentPreviewImageView.js';
import DecoratedAvatarView from './DecoratedAvatarView.js';
import DynamicTextView from './DynamicTextView.js';
import FlexibleActionsView from './FlexibleActionsView.js';
import DescriptionPreviewView from './DescriptionPreviewView.js';
import AttributionView from './AttributionView.js';
import ImageBannerView from './ImageBannerView.js';
export default class PageHeaderView extends YTNode {
    static type: string;
    title: DynamicTextView | null;
    image: ContentPreviewImageView | DecoratedAvatarView | null;
    animated_image: ContentPreviewImageView | null;
    hero_image: ContentPreviewImageView | null;
    metadata: ContentMetadataView | null;
    actions: FlexibleActionsView | null;
    description: DescriptionPreviewView | null;
    attributation: AttributionView | null;
    banner: ImageBannerView | null;
    constructor(data: RawNode);
}
