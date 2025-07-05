import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class EomSettingsDisclaimer extends YTNode {
    static type: string;
    disclaimer: Text;
    info_icon: {
        icon_type: string;
    };
    usage_scenario: string;
    constructor(data: RawNode);
}
