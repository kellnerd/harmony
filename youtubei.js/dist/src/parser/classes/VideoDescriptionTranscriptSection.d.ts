import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { Text } from '../misc.js';
import Button from './Button.js';
export default class VideoDescriptionTranscriptSection extends YTNode {
    static type: string;
    section_title: Text;
    sub_header_text: Text;
    primary_button: Button | null;
    constructor(data: RawNode);
}
