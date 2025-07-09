import type { YTNode } from '../../helpers.js';
import { type ObservedArray } from '../../helpers.js';
import { type RawNode } from '../../index.js';
import type NavigationEndpoint from '../NavigationEndpoint.js';
import Thumbnail from './Thumbnail.js';
export default class Author {
    id: string;
    name: string;
    thumbnails: Thumbnail[];
    endpoint?: NavigationEndpoint;
    badges: ObservedArray<YTNode>;
    is_moderator?: boolean;
    is_verified?: boolean;
    is_verified_artist?: boolean;
    url: string;
    constructor(item: RawNode, badges?: any, thumbs?: any, id?: string);
    get best_thumbnail(): Thumbnail | undefined;
}
