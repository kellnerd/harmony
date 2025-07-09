import { type RawNode } from '../index.js';
import { YTNode, type ObservedArray } from '../helpers.js';
import ButtonView from './ButtonView.js';
import VideoAttributeView from './VideoAttributeView.js';
export default class VideoAttributesSectionView extends YTNode {
    static type: string;
    header_title: string;
    header_subtitle: string;
    video_attributes: ObservedArray<VideoAttributeView>;
    previous_button: ButtonView | null;
    next_button: ButtonView | null;
    constructor(data: RawNode);
}
