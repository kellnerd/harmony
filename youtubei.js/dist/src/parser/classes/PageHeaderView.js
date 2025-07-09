import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ContentMetadataView from './ContentMetadataView.js';
import ContentPreviewImageView from './ContentPreviewImageView.js';
import DecoratedAvatarView from './DecoratedAvatarView.js';
import DynamicTextView from './DynamicTextView.js';
import FlexibleActionsView from './FlexibleActionsView.js';
import DescriptionPreviewView from './DescriptionPreviewView.js';
import AttributionView from './AttributionView.js';
import ImageBannerView from './ImageBannerView.js';
class PageHeaderView extends YTNode {
    constructor(data) {
        super();
        this.title = Parser.parseItem(data.title, DynamicTextView);
        this.image = Parser.parseItem(data.image, [ContentPreviewImageView, DecoratedAvatarView]);
        this.animated_image = Parser.parseItem(data.animatedImage, ContentPreviewImageView);
        this.hero_image = Parser.parseItem(data.heroImage, ContentPreviewImageView);
        this.metadata = Parser.parseItem(data.metadata, ContentMetadataView);
        this.actions = Parser.parseItem(data.actions, FlexibleActionsView);
        this.description = Parser.parseItem(data.description, DescriptionPreviewView);
        this.attributation = Parser.parseItem(data.attributation, AttributionView);
        this.banner = Parser.parseItem(data.banner, ImageBannerView);
    }
}
PageHeaderView.type = 'PageHeaderView';
export default PageHeaderView;
//# sourceMappingURL=PageHeaderView.js.map