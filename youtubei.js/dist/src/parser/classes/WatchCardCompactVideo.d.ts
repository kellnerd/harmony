import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class WatchCardCompactVideo extends YTNode {
    static type: string;
    title: Text;
    subtitle: Text;
    duration: {
        text: string;
        seconds: number;
    };
    style: string;
    constructor(data: RawNode);
}
