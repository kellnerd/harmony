import type { RawNode } from '../index.js';
import { Text } from '../misc.js';
import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class ShareTarget extends YTNode {
    static type: string;
    endpoint?: NavigationEndpoint;
    service_name: string;
    target_id: string;
    title: Text;
    constructor(data: RawNode);
}
