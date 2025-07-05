import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class Poll extends YTNode {
    constructor(data) {
        super();
        this.choices = data.choices.map((choice) => ({
            text: new Text(choice.text),
            select_endpoint: choice.selectServiceEndpoint ? new NavigationEndpoint(choice.selectServiceEndpoint) : null,
            deselect_endpoint: choice.deselectServiceEndpoint ? new NavigationEndpoint(choice.deselectServiceEndpoint) : null,
            vote_ratio_if_selected: choice?.voteRatioIfSelected || null,
            vote_percentage_if_selected: new Text(choice.votePercentageIfSelected),
            vote_ratio_if_not_selected: choice?.voteRatioIfSelected || null,
            vote_percentage_if_not_selected: new Text(choice.votePercentageIfSelected),
            image: choice.image ? Thumbnail.fromResponse(choice.image) : null
        }));
        if (Reflect.has(data, 'type'))
            this.poll_type = data.type;
        if (Reflect.has(data, 'totalVotes'))
            this.total_votes = new Text(data.totalVotes);
        if (Reflect.has(data, 'liveChatPollId'))
            this.live_chat_poll_id = data.liveChatPollId;
    }
}
Poll.type = 'Poll';
export default Poll;
//# sourceMappingURL=Poll.js.map