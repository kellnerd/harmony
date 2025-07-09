import Text from '../misc/Text.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class UpdateDescriptionAction extends YTNode {
    static type: string;
    description: Text;
    constructor(data: RawNode);
}
