import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
export default class HowThisWasMadeSectionView extends YTNode {
    static type: string;
    section_title?: Text;
    body_text?: Text;
    body_header?: Text;
    constructor(data: RawNode);
}
