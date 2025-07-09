import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export type AlertType = 'UNKNOWN' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'INFO';
export default class Alert extends YTNode {
    static type: string;
    text: Text;
    alert_type: AlertType;
    constructor(data: RawNode);
}
