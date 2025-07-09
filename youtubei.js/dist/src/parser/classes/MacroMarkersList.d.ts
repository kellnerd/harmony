import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import { Text } from '../misc.js';
import MacroMarkersInfoItem from './MacroMarkersInfoItem.js';
import MacroMarkersListItem from './MacroMarkersListItem.js';
export default class MacroMarkersList extends YTNode {
    static type: string;
    contents: ObservedArray<MacroMarkersInfoItem | MacroMarkersListItem>;
    sync_button_label: Text;
    constructor(data: RawNode);
}
