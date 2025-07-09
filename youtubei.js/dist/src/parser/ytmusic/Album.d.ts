import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicDetailHeader from '../classes/MusicDetailHeader.js';
import MusicResponsiveHeader from '../classes/MusicResponsiveHeader.js';
import type MusicThumbnail from '../classes/MusicThumbnail.js';
import type { ApiResponse } from '../../core/index.js';
import { type ObservedArray } from '../helpers.js';
import type { IBrowseResponse } from '../types/index.js';
import type MusicResponsiveListItem from '../classes/MusicResponsiveListItem.js';
export default class Album {
    #private;
    header?: MusicDetailHeader | MusicResponsiveHeader;
    contents: ObservedArray<MusicResponsiveListItem>;
    sections: ObservedArray<MusicCarouselShelf>;
    background?: MusicThumbnail;
    url?: string;
    constructor(response: ApiResponse);
    get page(): IBrowseResponse;
}
