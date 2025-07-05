import { timeToSeconds } from '../../utils/Utils.js';
import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class PlaylistPanelVideo extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.selected = data.selected;
        this.video_id = data.videoId;
        this.duration = {
            text: new Text(data.lengthText).toString(),
            seconds: timeToSeconds(new Text(data.lengthText).toString())
        };
        const album = new Text(data.longBylineText).runs?.find((run) => run.endpoint?.payload?.browseId?.startsWith('MPR'));
        const artists = new Text(data.longBylineText).runs?.filter((run) => run.endpoint?.payload?.browseId?.startsWith('UC'));
        this.author = new Text(data.shortBylineText).toString();
        if (album) {
            this.album = {
                id: album.endpoint?.payload?.browseId,
                name: album.text,
                year: new Text(data.longBylineText).runs?.slice(-1)[0].text,
                endpoint: album.endpoint
            };
        }
        if (artists) {
            this.artists = artists.map((artist) => ({
                name: artist.text,
                channel_id: artist.endpoint?.payload?.browseId,
                endpoint: artist.endpoint
            }));
        }
        this.badges = Parser.parseArray(data.badges);
        this.menu = Parser.parseItem(data.menu);
        this.set_video_id = data.playlistSetVideoId;
    }
}
PlaylistPanelVideo.type = 'PlaylistPanelVideo';
export default PlaylistPanelVideo;
//# sourceMappingURL=PlaylistPanelVideo.js.map