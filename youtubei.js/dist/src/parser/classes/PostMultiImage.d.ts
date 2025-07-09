import { type RawNode } from '../index.js';
import BackstageImage from './BackstageImage.js';
import { YTNode } from '../helpers.js';
export default class PostMultiImage extends YTNode {
    static type: string;
    images: BackstageImage[];
    constructor(data: RawNode);
}
