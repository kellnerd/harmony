import Button from '../classes/Button.js';
import type { Actions } from '../../core/index.js';
import type { ObservedArray, YTNode } from '../helpers.js';
import type { IParsedResponse } from '../types/index.js';
export default class ItemMenu {
    #private;
    constructor(data: IParsedResponse, actions: Actions);
    selectItem(icon_type: string): Promise<IParsedResponse>;
    selectItem(button: Button): Promise<IParsedResponse>;
    items(): ObservedArray<YTNode>;
    page(): IParsedResponse;
}
