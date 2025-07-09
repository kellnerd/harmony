import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
export default class ChannelSwitcherHeader extends YTNode {
    static type: string;
    title: string;
    button?: Button | null;
    constructor(data: RawNode);
}
