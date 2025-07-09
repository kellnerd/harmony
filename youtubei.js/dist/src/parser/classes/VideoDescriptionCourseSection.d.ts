import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import StructuredDescriptionPlaylistLockup from './StructuredDescriptionPlaylistLockup.js';
import Text from './misc/Text.js';
export default class VideoDescriptionCourseSection extends YTNode {
    static type: string;
    section_title: Text;
    media_lockups: ObservedArray<StructuredDescriptionPlaylistLockup>;
    constructor(data: RawNode);
}
