import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface PlaybackContext {
    contentPlaybackContext?: PlaybackContext_ContentPlaybackContext | undefined;
}
export interface PlaybackContext_ContentPlaybackContext {
    deviceSignals?: string | undefined;
    revShareClientId?: string | undefined;
    timeSinceLastAdSeconds?: number | undefined;
    lactMilliseconds?: number | undefined;
    autoplaysSinceLastAd?: number | undefined;
    vis?: number | undefined;
    fling?: boolean | undefined;
    splay?: boolean | undefined;
    autoplay?: boolean | undefined;
    timeOfLastInstreamPrerollAd?: number | undefined;
    currentUrl?: string | undefined;
    referer?: string | undefined;
    loadAnnotationsByDemand?: boolean | undefined;
    autoCaptionsDefaultOn?: boolean | undefined;
    /** optional ForceAdParameters force_ad_parameters = 25; */
    slicedBread?: boolean | undefined;
    autonav?: boolean | undefined;
    trailer?: boolean | undefined;
    /**
     * optional MdxPlaybackContext mdx_context = 31;
     * optional LivePlaybackContext live_context = 32;
     */
    playerWidthPixels?: number | undefined;
    playerHeightPixels?: number | undefined;
    /** optional Html5Preference html5_preference = 36; */
    snd?: number | undefined;
    vnd?: number | undefined;
    /** optional UnpluggedContentPlaybackContext unplugged_context = 40; */
    uao?: number | undefined;
    mutedAutoplay?: boolean | undefined;
    /** optional AutonavSettingsState autonav_state = 45; */
    enablePrivacyFilter?: boolean | undefined;
    isLivingRoomDeeplink?: boolean | undefined;
    signatureTimestamp?: number | undefined;
    /** optional TrailerPlaybackContext trailer_context = 49; */
    isInlinePlaybackNoAd?: boolean | undefined;
    isInlineUnmutedPlayback?: boolean | undefined;
    /**
     * optional CustomTabContext custom_tab_context = 52;
     * optional VideoPlaybackPosition player_playback_position = 54;
     */
    playPackageVersion?: number | undefined;
    /**
     * optional CoWatchPlaybackContext co_watch_context = 56;
     * optional WatchAmbientModePlaybackContext watch_ambient_mode_context = 57;
     * optional CompositeVideoPlaybackContext composite_video_context = 58;
     */
    isSequenceEntry?: boolean | undefined;
}
export declare const PlaybackContext: MessageFns<PlaybackContext>;
export declare const PlaybackContext_ContentPlaybackContext: MessageFns<PlaybackContext_ContentPlaybackContext>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
