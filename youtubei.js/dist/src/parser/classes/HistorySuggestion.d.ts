import type { RawNode } from '../index.js';
import SearchSuggestion from './SearchSuggestion.js';
export default class HistorySuggestion extends SearchSuggestion {
    static type: string;
    constructor(data: RawNode);
}
