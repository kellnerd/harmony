import type { ObservedArray } from '../../helpers.js';
import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
export default class CommandExecutorCommand extends YTNode {
    static type: string;
    commands: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
