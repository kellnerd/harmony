import { Feed } from './index.js';
import type { Actions, ApiResponse } from '../index.js';
import type { IParsedResponse } from '../../parser/index.js';
export default class TabbedFeed<T extends IParsedResponse> extends Feed<T> {
    #private;
    constructor(actions: Actions, data: ApiResponse | IParsedResponse, already_parsed?: boolean);
    get tabs(): string[];
    getTabByName(title: string): Promise<TabbedFeed<T>>;
    getTabByURL(url: string): Promise<TabbedFeed<T>>;
    hasTabWithURL(url: string): boolean;
    get title(): string | undefined;
}
