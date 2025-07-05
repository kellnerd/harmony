import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class MusicDescriptionShelf extends YTNode {
    static type: string;
    description: Text;
    max_collapsed_lines?: string;
    max_expanded_lines?: string;
    footer: Text;
    constructor(data: RawNode);
}
