import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class RichListHeader extends YTNode {
    static type: string;
    title: Text;
    subtitle: Text;
    title_style?: string;
    icon_type?: string;
    constructor(data: RawNode);
}
