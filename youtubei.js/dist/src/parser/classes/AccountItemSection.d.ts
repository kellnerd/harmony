import AccountItem from './AccountItem.js';
import AccountItemSectionHeader from './AccountItemSectionHeader.js';
import { YTNode, type ObservedArray } from '../helpers.js';
import type { RawNode } from '../index.js';
import CompactLink from './CompactLink.js';
export default class AccountItemSection extends YTNode {
    static type: string;
    contents: ObservedArray<AccountItem | CompactLink>;
    header: AccountItemSectionHeader | null;
    constructor(data: RawNode);
}
