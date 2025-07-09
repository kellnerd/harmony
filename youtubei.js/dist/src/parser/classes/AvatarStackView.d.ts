import { type ObservedArray, YTNode } from '../helpers.js';
import type { RawNode } from '../types/index.js';
import Text from './misc/Text.js';
import AvatarView from './AvatarView.js';
import RendererContext from './misc/RendererContext.js';
export default class AvatarStackView extends YTNode {
    static type: string;
    avatars: ObservedArray<AvatarView>;
    text?: Text;
    renderer_context: RendererContext;
    constructor(data: RawNode);
}
