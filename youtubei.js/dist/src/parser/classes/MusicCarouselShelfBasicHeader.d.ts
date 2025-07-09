import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import IconLink from './IconLink.js';
import MusicThumbnail from './MusicThumbnail.js';
import Text from './misc/Text.js';
export default class MusicCarouselShelfBasicHeader extends YTNode {
    static type: string;
    title: Text;
    strapline?: Text;
    thumbnail?: MusicThumbnail | null;
    more_content?: Button | null;
    end_icons?: ObservedArray<IconLink>;
    constructor(data: RawNode);
}
