import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import Dropdown from './Dropdown.js';
export default class CreatePlaylistDialog extends YTNode {
    static type: string;
    title: string;
    title_placeholder: string;
    privacy_option: Dropdown | null;
    cancel_button: Button | null;
    create_button: Button | null;
    constructor(data: RawNode);
}
