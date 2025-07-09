import * as Constants from '../../../utils/Constants.js';
import { observe } from '../../helpers.js';
import { Parser } from '../../index.js';
import Text from './Text.js';
import Thumbnail from './Thumbnail.js';
export default class Author {
    constructor(item, badges, thumbs, id) {
        const nav_text = new Text(item);
        this.id = id || nav_text?.runs?.[0]?.endpoint?.payload?.browseId || nav_text?.endpoint?.payload?.browseId || 'N/A';
        this.name = nav_text?.text || 'N/A';
        this.thumbnails = thumbs ? Thumbnail.fromResponse(thumbs) : [];
        this.endpoint = nav_text?.runs?.[0]?.endpoint || nav_text?.endpoint;
        if (badges) {
            if (Array.isArray(badges)) {
                this.badges = Parser.parseArray(badges);
                this.is_moderator = this.badges?.some((badge) => badge.icon_type == 'MODERATOR');
                this.is_verified = this.badges?.some((badge) => badge.style == 'BADGE_STYLE_TYPE_VERIFIED');
                this.is_verified_artist = this.badges?.some((badge) => badge.style == 'BADGE_STYLE_TYPE_VERIFIED_ARTIST');
            }
            else {
                this.badges = observe([]);
                this.is_verified = !!badges.isVerified;
                this.is_verified_artist = !!badges.isArtist;
            }
        }
        else {
            this.badges = observe([]);
        }
        // @TODO: Refactor this mess.
        this.url =
            nav_text?.runs?.[0]?.endpoint?.metadata?.api_url === '/browse' &&
                `${Constants.URLS.YT_BASE}${nav_text?.runs?.[0]?.endpoint?.payload?.canonicalBaseUrl || `/u/${nav_text?.runs?.[0]?.endpoint?.payload?.browseId}`}` ||
                `${Constants.URLS.YT_BASE}${nav_text?.endpoint?.payload?.canonicalBaseUrl || `/u/${nav_text?.endpoint?.payload?.browseId}`}`;
    }
    get best_thumbnail() {
        return this.thumbnails[0];
    }
}
//# sourceMappingURL=Author.js.map