import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import AvatarView from './AvatarView.js';
import RendererContext from './misc/RendererContext.js';
export default class DecoratedAvatarView extends YTNode {
    static type: string;
    avatar: AvatarView | null;
    a11y_label: string;
    renderer_context: RendererContext;
    constructor(data: RawNode);
}
