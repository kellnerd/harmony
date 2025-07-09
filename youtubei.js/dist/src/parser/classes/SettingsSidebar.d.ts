import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import CompactLink from './CompactLink.js';
import Text from './misc/Text.js';
export default class SettingsSidebar extends YTNode {
    static type: string;
    title: Text;
    items: ObservedArray<CompactLink>;
    constructor(data: RawNode);
    get contents(): ObservedArray<CompactLink>;
}
