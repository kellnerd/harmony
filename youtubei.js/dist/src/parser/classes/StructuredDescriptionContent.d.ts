import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
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
export default class StructuredDescriptionContent extends YTNode {
    static type: string;
    items: ObservedArray<VideoDescriptionHeader | ExpandableVideoDescriptionBody | VideoDescriptionMusicSection | VideoDescriptionInfocardsSection | VideoDescriptionTranscriptSection | VideoDescriptionCourseSection | HorizontalCardList | ReelShelf | VideoAttributesSectionView | HowThisWasMadeSectionView>;
    constructor(data: RawNode);
}
