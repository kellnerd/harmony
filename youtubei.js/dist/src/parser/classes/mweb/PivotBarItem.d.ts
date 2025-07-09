import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
import { type AccessibilitySupportedDatas } from '../misc/AccessibilityData.js';
export default class PivotBarItem extends YTNode {
    static type: string;
    pivot_identifier: string;
    endpoint: NavigationEndpoint;
    title: Text;
    accessibility_label?: string;
    icon_type?: string;
    accessibility?: AccessibilitySupportedDatas;
    constructor(data: RawNode);
    get label(): string | undefined;
}
