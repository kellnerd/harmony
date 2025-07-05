import { escape } from './Text.js';
import Thumbnail from './Thumbnail.js';
export default class EmojiRun {
    constructor(data) {
        this.text =
            data.emoji?.emojiId ||
                data.emoji?.shortcuts?.[0] ||
                data.text ||
                '';
        this.emoji = {
            emoji_id: data.emoji.emojiId,
            shortcuts: data.emoji?.shortcuts || [],
            search_terms: data.emoji?.searchTerms || [],
            image: Thumbnail.fromResponse(data.emoji.image),
            is_custom: !!data.emoji?.isCustomEmoji
        };
    }
    toString() {
        return this.text;
    }
    toHTML() {
        const escaped_text = escape(this.text);
        return `<img src="${this.emoji.image[0].url}" alt="${escaped_text}" title="${escaped_text}" style="display: inline-block; vertical-align: text-top; height: var(--yt-emoji-size, 1rem); width: var(--yt-emoji-size, 1rem);" loading="lazy" crossorigin="anonymous" />`;
    }
}
//# sourceMappingURL=EmojiRun.js.map