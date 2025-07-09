import { Jinter } from 'jintr';
import type { FetchFunction, ICache } from '../types/index.js';
import { type ASTLookupResult } from '../utils/Utils.js';
/**
 * Represents YouTube's player script. This is required to decipher signatures.
 */
export default class Player {
    player_id: string;
    sts: number;
    nsig_sc?: string;
    sig_sc?: string;
    po_token?: string;
    constructor(player_id: string, signature_timestamp: number, sig_sc?: string, nsig_sc?: string);
    static create(cache: ICache | undefined, fetch?: FetchFunction, po_token?: string, player_id?: string): Promise<Player>;
    decipher(url?: string, signature_cipher?: string, cipher?: string, this_response_nsig_cache?: Map<string, string>): string;
    static fromCache(cache: ICache, player_id: string): Promise<Player | null>;
    static fromSource(player_id: string, sig_timestamp: number, cache?: ICache, sig_sc?: string, nsig_sc?: string): Promise<Player>;
    cache(cache?: ICache): Promise<void>;
    static extractSigTimestamp(data: string): number;
    static extractGlobalVariable(data: string, ast: ReturnType<typeof Jinter.parseScript>): ASTLookupResult | undefined;
    static extractSigSourceCode(data: string, global_variable?: ASTLookupResult): string | undefined;
    static extractNSigSourceCode(data: string, ast?: ReturnType<typeof Jinter.parseScript>, global_variable?: ASTLookupResult): string | undefined;
    get url(): string;
    static get LIBRARY_VERSION(): number;
}
