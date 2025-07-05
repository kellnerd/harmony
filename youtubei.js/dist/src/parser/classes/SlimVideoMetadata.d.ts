import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class SlimVideoMetadata extends YTNode {
    static type: string;
    title: Text;
    collapsed_subtitle: Text;
    expanded_subtitle: Text;
    owner: YTNode;
    description: Text;
    video_id: string;
    date: Text;
    constructor(data: RawNode);
}
