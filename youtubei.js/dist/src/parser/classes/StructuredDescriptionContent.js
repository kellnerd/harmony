import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ExpandableVideoDescriptionBody from './ExpandableVideoDescriptionBody.js';
import HorizontalCardList from './HorizontalCardList.js';
import VideoDescriptionHeader from './VideoDescriptionHeader.js';
import VideoDescriptionInfocardsSection from './VideoDescriptionInfocardsSection.js';
import VideoDescriptionMusicSection from './VideoDescriptionMusicSection.js';
import VideoDescriptionTranscriptSection from './VideoDescriptionTranscriptSection.js';
import VideoDescriptionCourseSection from './VideoDescriptionCourseSection.js';
import VideoAttributesSectionView from './VideoAttributesSectionView.js';
import HowThisWasMadeSectionView from './HowThisWasMadeSectionView.js';
import ReelShelf from './ReelShelf.js';
class StructuredDescriptionContent extends YTNode {
    constructor(data) {
        super();
        this.items = Parser.parseArray(data.items, [
            VideoDescriptionHeader, ExpandableVideoDescriptionBody, VideoDescriptionMusicSection,
            VideoDescriptionInfocardsSection, VideoDescriptionCourseSection, VideoDescriptionTranscriptSection,
            VideoDescriptionTranscriptSection, HorizontalCardList, ReelShelf, VideoAttributesSectionView,
            HowThisWasMadeSectionView
        ]);
    }
}
StructuredDescriptionContent.type = 'StructuredDescriptionContent';
export default StructuredDescriptionContent;
//# sourceMappingURL=StructuredDescriptionContent.js.map