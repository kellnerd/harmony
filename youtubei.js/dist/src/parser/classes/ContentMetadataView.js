import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
import { Parser } from '../index.js';
import AvatarStackView from './AvatarStackView.js';
class ContentMetadataView extends YTNode {
    constructor(data) {
        super();
        this.metadata_rows = data.metadataRows.map((row) => ({
            metadata_parts: row.metadataParts?.map((part) => ({
                text: part.text ? Text.fromAttributed(part.text) : null,
                avatar_stack: Parser.parseItem(part.avatarStack, AvatarStackView),
                enable_truncation: data.enableTruncation
            }))
        }));
        this.delimiter = data.delimiter;
    }
}
ContentMetadataView.type = 'ContentMetadataView';
export default ContentMetadataView;
//# sourceMappingURL=ContentMetadataView.js.map