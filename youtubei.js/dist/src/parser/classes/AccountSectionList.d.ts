import AccountChannel from './AccountChannel.js';
import AccountItemSection from './AccountItemSection.js';
import type { RawNode } from '../index.js';
import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
export default class AccountSectionList extends YTNode {
    static type: string;
    contents: ObservedArray<AccountItemSection>;
    footers: ObservedArray<AccountChannel>;
    constructor(data: RawNode);
}
