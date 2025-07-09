import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import EndScreenPlaylist from './EndScreenPlaylist.js';
import EndScreenVideo from './EndScreenVideo.js';
export default class WatchNextEndScreen extends YTNode {
    static type: string;
    results: ObservedArray<EndScreenVideo | EndScreenPlaylist>;
    title: string;
    constructor(data: RawNode);
}
