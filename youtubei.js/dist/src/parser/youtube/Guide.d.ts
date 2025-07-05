import GuideSection from '../classes/GuideSection.js';
import GuideSubscriptionsSection from '../classes/GuideSubscriptionsSection.js';
import type { ObservedArray } from '../helpers.js';
import type { IGuideResponse } from '../types/index.js';
import type { IRawResponse } from '../index.js';
export default class Guide {
    #private;
    contents?: ObservedArray<GuideSection | GuideSubscriptionsSection>;
    constructor(data: IRawResponse);
    get page(): IGuideResponse;
}
