import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
import Text from './misc/Text.js';
import Menu from './menus/Menu.js';
import MetadataBadge from './MetadataBadge.js';
import VideoViewCount from './VideoViewCount.js';
export default class VideoPrimaryInfo extends YTNode {
    static type: string;
    title: Text;
    super_title_link?: Text;
    station_name?: Text;
    view_count: VideoViewCount | null;
    badges: ObservedArray<MetadataBadge>;
    published: Text;
    relative_date: Text;
    menu: Menu | null;
    constructor(data: RawNode);
}
