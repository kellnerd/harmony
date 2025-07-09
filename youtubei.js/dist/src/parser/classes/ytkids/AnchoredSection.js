import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
import SectionList from '../SectionList.js';
class AnchoredSection extends YTNode {
    constructor(data) {
        super();
        this.title = data.title;
        this.content = Parser.parseItem(data.content, SectionList);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.category_assets = {
            asset_key: data.categoryAssets?.assetKey,
            background_color: data.categoryAssets?.backgroundColor
        };
        this.category_type = data.categoryType;
    }
}
AnchoredSection.type = 'AnchoredSection';
export default AnchoredSection;
//# sourceMappingURL=AnchoredSection.js.map