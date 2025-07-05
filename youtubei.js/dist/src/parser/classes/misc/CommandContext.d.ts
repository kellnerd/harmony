import type { RawNode } from '../../types/index.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
export default class CommandContext {
    on_focus?: NavigationEndpoint;
    on_hidden?: NavigationEndpoint;
    on_touch_end?: NavigationEndpoint;
    on_touch_move?: NavigationEndpoint;
    on_long_press?: NavigationEndpoint;
    on_tap?: NavigationEndpoint;
    on_touch_start?: NavigationEndpoint;
    on_visible?: NavigationEndpoint;
    on_first_visible?: NavigationEndpoint;
    on_hover?: NavigationEndpoint;
    constructor(data: RawNode);
}
