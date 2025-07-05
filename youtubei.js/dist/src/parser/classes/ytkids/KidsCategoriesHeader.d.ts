import Button from '../Button.js';
import KidsCategoryTab from './KidsCategoryTab.js';
import { type ObservedArray, YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class KidsCategoriesHeader extends YTNode {
    static type: string;
    category_tabs: ObservedArray<KidsCategoryTab>;
    privacy_button: Button | null;
    constructor(data: RawNode);
}
