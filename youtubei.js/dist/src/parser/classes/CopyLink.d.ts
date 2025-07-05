import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
export default class CopyLink extends YTNode {
    static type: string;
    copy_button: Button | null;
    short_url: string;
    style: string;
    constructor(data: RawNode);
}
