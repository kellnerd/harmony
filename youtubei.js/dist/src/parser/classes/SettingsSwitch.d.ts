import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class SettingsSwitch extends YTNode {
    static type: string;
    title: Text;
    subtitle: Text;
    enabled: boolean;
    enable_endpoint: NavigationEndpoint;
    disable_endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
