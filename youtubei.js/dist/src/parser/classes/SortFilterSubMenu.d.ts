import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { type AccessibilitySupportedDatas } from './misc/AccessibilityData.js';
export interface SubMenuItem {
    title: string;
    selected: boolean;
    continuation: string;
    endpoint: NavigationEndpoint;
    subtitle: string | null;
}
export default class SortFilterSubMenu extends YTNode {
    static type: string;
    title?: string;
    icon_type?: string;
    tooltip?: string;
    sub_menu_items?: SubMenuItem[];
    accessibility?: AccessibilitySupportedDatas;
    constructor(data: RawNode);
    get label(): string | undefined;
}
