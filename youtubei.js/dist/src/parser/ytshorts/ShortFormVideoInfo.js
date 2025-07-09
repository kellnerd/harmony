var _ShortFormVideoInfo_watch_next_continuation;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser, ContinuationCommand } from '../index.js';
import { InnertubeError } from '../../utils/Utils.js';
import MediaInfo from '../../core/mixins/MediaInfo.js';
class ShortFormVideoInfo extends MediaInfo {
    constructor(data, actions, cpn, reel_watch_sequence_response) {
        super(data, actions, cpn);
        _ShortFormVideoInfo_watch_next_continuation.set(this, void 0);
        if (reel_watch_sequence_response) {
            const reel_watch_sequence = Parser.parseResponse(reel_watch_sequence_response.data);
            if (reel_watch_sequence.entries)
                this.watch_next_feed = reel_watch_sequence.entries;
            if (reel_watch_sequence.continuation_endpoint)
                __classPrivateFieldSet(this, _ShortFormVideoInfo_watch_next_continuation, reel_watch_sequence.continuation_endpoint?.as(ContinuationCommand), "f");
        }
    }
    async getWatchNextContinuation() {
        if (!__classPrivateFieldGet(this, _ShortFormVideoInfo_watch_next_continuation, "f"))
            throw new InnertubeError('Continuation not found');
        const response = await this.actions.execute('/reel/reel_watch_sequence', {
            sequenceParams: __classPrivateFieldGet(this, _ShortFormVideoInfo_watch_next_continuation, "f").token,
            parse: true
        });
        if (response.entries)
            this.watch_next_feed = response.entries;
        __classPrivateFieldSet(this, _ShortFormVideoInfo_watch_next_continuation, response.continuation_endpoint?.as(ContinuationCommand), "f");
        return this;
    }
    /**
     * Checks if continuation is available for the watch next feed.
     */
    get wn_has_continuation() {
        return !!__classPrivateFieldGet(this, _ShortFormVideoInfo_watch_next_continuation, "f");
    }
}
_ShortFormVideoInfo_watch_next_continuation = new WeakMap();
export default ShortFormVideoInfo;
//# sourceMappingURL=ShortFormVideoInfo.js.map