import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import Button from './Button.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class RecognitionShelf extends YTNode {
    static type: string;
    title: Text;
    subtitle: Text;
    avatars: Thumbnail[];
    button: Button | null;
    surface: string;
    constructor(data: RawNode);
}
