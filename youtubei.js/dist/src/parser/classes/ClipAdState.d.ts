import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
import type { RawNode } from '../types/index.js';
export default class ClipAdState extends YTNode {
    static type: string;
    title: Text;
    body: Text;
    constructor(data: RawNode);
}
