import type { ObservedArray } from '../../helpers.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import Button from '../Button.js';
import Text from '../misc/Text.js';
export default class SimpleMenuHeader extends YTNode {
    static type: string;
    title: Text;
    buttons: ObservedArray<Button>;
    constructor(data: RawNode);
}
