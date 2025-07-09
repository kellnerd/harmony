import type { Session } from '../core/index.js';
import type { FetchFunction } from '../types/index.js';
export interface HTTPClientInit {
    baseURL?: string;
}
export default class HTTPClient {
    #private;
    constructor(session: Session, cookie?: string, fetch?: FetchFunction);
    get fetch_function(): FetchFunction;
    fetch(input: URL | Request | string, init?: RequestInit & HTTPClientInit): Promise<Response>;
}
