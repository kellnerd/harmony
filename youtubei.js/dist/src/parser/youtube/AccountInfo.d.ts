import type { ApiResponse } from '../../core/index.js';
import type { IParsedResponse } from '../types/index.js';
import type AccountItemSection from '../classes/AccountItemSection.js';
export default class AccountInfo {
    #private;
    contents: AccountItemSection | null;
    constructor(response: ApiResponse);
    get page(): IParsedResponse;
}
