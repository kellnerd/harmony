import type { RawNode } from '../index.js';
import BackstagePost from './BackstagePost.js';
export default class Post extends BackstagePost {
    static type: string;
    constructor(data: RawNode);
}
