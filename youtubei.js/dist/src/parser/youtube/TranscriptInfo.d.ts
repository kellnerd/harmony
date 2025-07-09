import Transcript from '../classes/Transcript.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type { IGetTranscriptResponse } from '../index.js';
export default class TranscriptInfo {
    #private;
    transcript: Transcript;
    constructor(actions: Actions, response: ApiResponse);
    /**
     * Selects a language from the language menu and returns the updated transcript.
     * @param language - Language to select.
     */
    selectLanguage(language: string): Promise<TranscriptInfo>;
    /**
     * Returns available languages.
     */
    get languages(): string[];
    /**
     * Returns the currently selected language.
     */
    get selectedLanguage(): string;
    get page(): IGetTranscriptResponse;
}
