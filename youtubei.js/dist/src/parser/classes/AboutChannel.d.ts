import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import AboutChannelView from './AboutChannelView.js';
import Button from './Button.js';
export default class AboutChannel extends YTNode {
    static type: string;
    metadata: AboutChannelView | null;
    share_channel: Button | null;
    constructor(data: RawNode);
}
