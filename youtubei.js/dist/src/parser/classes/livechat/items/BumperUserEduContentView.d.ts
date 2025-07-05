import { YTNode } from '../../../helpers.js';
import { type RawNode } from '../../../index.js';
import Text from '../../misc/Text.js';
export default class BumperUserEduContentView extends YTNode {
    static type: string;
    text: Text;
    image_name: string;
    image_color: number;
    constructor(data: RawNode);
}
