import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ButtonView from './ButtonView.js';
import ToggleButtonView from './ToggleButtonView.js';
export type ActionRow = {
    actions: ObservedArray<ButtonView | ToggleButtonView>;
};
export default class FlexibleActionsView extends YTNode {
    static type: string;
    actions_rows: ActionRow[];
    style: string;
    constructor(data: RawNode);
}
