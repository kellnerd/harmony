import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import { Text } from '../misc.js';
import CarouselLockup from './CarouselLockup.js';
export default class VideoDescriptionMusicSection extends YTNode {
    static type: string;
    carousel_lockups: ObservedArray<CarouselLockup>;
    section_title: Text;
    constructor(data: RawNode);
}
