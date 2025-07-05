import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ClipSection from './ClipSection.js';
import ContinuationItem from './ContinuationItem.js';
import EngagementPanelTitleHeader from './EngagementPanelTitleHeader.js';
import MacroMarkersList from './MacroMarkersList.js';
import ProductList from './ProductList.js';
import SectionList from './SectionList.js';
import StructuredDescriptionContent from './StructuredDescriptionContent.js';
import VideoAttributeView from './VideoAttributeView.js';
class EngagementPanelSectionList extends YTNode {
    constructor(data) {
        super();
        this.header = Parser.parseItem(data.header, EngagementPanelTitleHeader);
        this.content = Parser.parseItem(data.content, [VideoAttributeView, SectionList, ContinuationItem, ClipSection, StructuredDescriptionContent, MacroMarkersList, ProductList]);
        this.panel_identifier = data.panelIdentifier;
        this.identifier = data.identifier ? {
            surface: data.identifier.surface,
            tag: data.identifier.tag
        } : undefined;
        this.target_id = data.targetId;
        this.visibility = data.visibility;
    }
}
EngagementPanelSectionList.type = 'EngagementPanelSectionList';
export default EngagementPanelSectionList;
//# sourceMappingURL=EngagementPanelSectionList.js.map