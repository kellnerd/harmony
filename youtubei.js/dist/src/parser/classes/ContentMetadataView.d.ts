import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { Text } from '../misc.js';
import AvatarStackView from './AvatarStackView.js';
export type MetadataRow = {
    metadata_parts?: {
        text: Text | null;
        avatar_stack: AvatarStackView | null;
        enable_truncation?: boolean;
    }[];
};
export default class ContentMetadataView extends YTNode {
    static type: string;
    metadata_rows: MetadataRow[];
    delimiter: string;
    constructor(data: RawNode);
}
