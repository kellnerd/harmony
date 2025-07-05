import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import RendererContext from './misc/RendererContext.js';
export default class ButtonCardView extends YTNode {
    static type: string;
    title: string;
    icon_name: string;
    renderer_context: RendererContext;
    constructor(data: RawNode);
}
