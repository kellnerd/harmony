export type SoundcloudImageFormats = "t500x500" | "crop" | "t300x300" | "large" | "t67x67" | "badge" | "small" | "tiny" | "mini"

export type SoundcloudLicense =
    | "no-rights-reserved"
    | "all-rights-reserved"
    | "cc-by"
    | "cc-by-nc"
    | "cc-by-nd"
    | "cc-by-sa"
    | "cc-by-nc-nd"
    | "cc-by-nc-sa"

export type SoundcloudTrackType =
    | "original"
    | "remix"
    | "live"
    | "recording"
    | "spoken"
    | "podcast"
    | "demo"
    | "in progress"
    | "stem"
    | "loop"
    | "sound effect"
    | "sample"
    | "other"

export interface SoundcloudTrack {
    comment_count: number
    full_duration: number
    downloadable: boolean
    created_at: string
    description: string | null
    media: {
        transcodings: SoundcloudTranscoding[]
    }
    title: string
    publisher_metadata: {
        id: number
        urn: string
        artist: string
        album_title: string
        contains_music: boolean
        upc_or_ean: string
        isrc: string
        explicit: boolean
        p_line: string
        p_line_for_display: string
        c_line: string
        c_line_for_display: string
        writer_composer: string
        release_title: string
        publisher: string
    }
    duration: number
    has_downloads_left: boolean
    artwork_url: string
    public: boolean
    streamable: boolean
    tag_list: string
    genre: string
    id: number
    reposts_count: number
    state: "processing" | "failed" | "finished"
    label_name: string | null
    last_modified: string
    commentable: boolean
    policy: string
    visuals: string | null
    kind: string
    purchase_url: string | null
    sharing: "private" | "public"
    uri: string
    secret_token: string | null
    download_count: number
    likes_count: number
    urn: string
    license: SoundcloudLicense
    purchase_title: string | null
    display_date: string
    embeddable_by: "all" | "me" | "none"
    release_date: string
    user_id: number
    monetization_model: string
    waveform_url: string
    permalink: string
    permalink_url: string
    user: SoundcloudUser
    playback_count: number
}
export interface SoundcloudTrackSearch extends SoundcloudSearch {
    collection: SoundcloudTrack[]
}

export interface SoundcloudSecretToken {
    kind: "secret-token"
    token: string
    uri: string
    resource_uri: string
}

export interface SoundcloudTranscoding {
    url: string
    preset: string
    duration: number
    snipped: boolean
    format: {
        protocol: string
        mime_type: string
    }
    quality: string
}

export interface SoundcloudTrackFilter extends SoundcloudFilter {
    "filter.genre_or_tag"?: string
    "filter.duration"?: "short" | "medium" | "long" | "epic"
    "filter.created_at"?: "last_hour" | "last_day" | "last_week" | "last_month" | "last_year"
    "filter.license"?: "to_modify_commercially" | "to_share" | "to_use_commercially"
}
export interface SoundcloudPlaylist {
    duration: number
    permalink_url: string
    reposts_count: number
    genre: string | null
    permalink: string
    purchase_url: string | null
    description: string | null
    uri: string
		urn: string
    label_name: string | null
    tag_list: string
    set_type: string
    public: boolean
    track_count: number
    user_id: number
    last_modified: string
    license: SoundcloudLicense
    tracks: SoundcloudTrack[]
    id: number
    release_date: string | null
    display_date: string
    sharing: "public" | "private"
    secret_token: string | null
    created_at: string
    likes_count: number
    kind: string
    title: string
    purchase_title: string | null
    managed_by_feeds: boolean
    artwork_url: string | null
    is_album: boolean
    user: SoundcloudUser
    published_at: string | null
    embeddable_by: "all" | "me" | "none"
}

export interface SoundcloudPlaylistSearch extends SoundcloudSearch {
    collection: SoundcloudPlaylist[]
}

export interface SoundcloudPlaylistFilter extends SoundcloudFilter {
    "filter.genre_or_tag"?: string
}
export interface SoundcloudApp {
    id: number
    kind: "app"
    name: string
    uri: string
    permalink_url: string
    external_url: string
    creator: string
}

export interface SoundcloudSearch {
    total_results: number
    next_href: string
    query_urn: string
}

export interface SoundcloudFilter {
    q: string
    limit?: number
    offset?: number
}
export interface SoundcloudUserMini {
    avatar_url: string
    id: number
    kind: string
    permalink_url: string
    uri: string
    username: string
    permalink: string
    last_modified: string
}

export interface SoundcloudUser {
    avatar_url: string
    city: string
    comments_count: number
    country_code: number | null
    created_at: string
    creator_subscriptions: SoundcloudCreatorSubscription[]
    creator_subscription: SoundcloudCreatorSubscription
    description: string
    followers_count: number
    followings_count: number
    first_name: string
    full_name: string
    groups_count: number
    id: number
    kind: string
    last_modified: string
    last_name: string
    likes_count: number
    playlist_likes_count: number
    permalink: string
    permalink_url: string
    playlist_count: number
    reposts_count: number | null
    track_count: number
    uri: string
    urn: string
    username: string
    verified: boolean
    visuals: {
        urn: string
        enabled: boolean
        visuals: SoundcloudVisual[]
        tracking: null
    }
}

export interface SoundcloudUserSearch extends SoundcloudSearch {
    collection: SoundcloudUser[]
}

export interface SoundcloudWebProfile {
    network: string
    title: string
    url: string
    username: string | null
}

export interface SoundcloudUserCollection {
    collection: SoundcloudUser
    next_href: string | null
}

export interface SoundcloudVisual {
    urn: string
    entry_time: number
    visual_url: string
}

export interface SoundcloudCreatorSubscription {
    product: {
        id: string
    }
}

export interface SoundcloudUserFilter extends SoundcloudFilter {
    "filter.place"?: string
}
export interface SoundcloudUserMini {
    avatar_url: string
    id: number
    kind: string
    permalink_url: string
    uri: string
    username: string
    permalink: string
    last_modified: string
}

export interface SoundcloudUser {
    avatar_url: string
    city: string
    comments_count: number
    country_code: number | null
    created_at: string
    creator_subscriptions: SoundcloudCreatorSubscription[]
    creator_subscription: SoundcloudCreatorSubscription
    description: string
    followers_count: number
    followings_count: number
    first_name: string
    full_name: string
    groups_count: number
    id: number
    kind: string
    last_modified: string
    last_name: string
    likes_count: number
    playlist_likes_count: number
    permalink: string
    permalink_url: string
    playlist_count: number
    reposts_count: number | null
    track_count: number
    uri: string
    urn: string
    username: string
    verified: boolean
    visuals: {
        urn: string
        enabled: boolean
        visuals: SoundcloudVisual[]
        tracking: null
    }
}

export interface SoundcloudUserSearch extends SoundcloudSearch {
    collection: SoundcloudUser[]
}

export interface SoundcloudWebProfile {
    network: string
    title: string
    url: string
    username: string | null
}

export interface SoundcloudUserCollection {
    collection: SoundcloudUser
    next_href: string | null
}

export interface SoundcloudVisual {
    urn: string
    entry_time: number
    visual_url: string
}

export interface SoundcloudCreatorSubscription {
    product: {
        id: string
    }
}

export interface SoundcloudUserFilter extends SoundcloudFilter {
    "filter.place"?: string
}
export interface SoundcloudUserMini {
    avatar_url: string
    id: number
    kind: string
    permalink_url: string
    uri: string
    username: string
    permalink: string
    last_modified: string
}

export interface SoundcloudUser {
    avatar_url: string
    city: string
    comments_count: number
    country_code: number | null
    created_at: string
    creator_subscriptions: SoundcloudCreatorSubscription[]
    creator_subscription: SoundcloudCreatorSubscription
    description: string
    followers_count: number
    followings_count: number
    first_name: string
    full_name: string
    groups_count: number
    id: number
    kind: string
    last_modified: string
    last_name: string
    likes_count: number
    playlist_likes_count: number
    permalink: string
    permalink_url: string
    playlist_count: number
    reposts_count: number | null
    track_count: number
    uri: string
    urn: string
    username: string
    verified: boolean
    visuals: {
        urn: string
        enabled: boolean
        visuals: SoundcloudVisual[]
        tracking: null
    }
}

export interface SoundcloudUserSearch extends SoundcloudSearch {
    collection: SoundcloudUser[]
}

export interface SoundcloudWebProfile {
    network: string
    title: string
    url: string
    username: string | null
}

export interface SoundcloudUserCollection {
    collection: SoundcloudUser
    next_href: string | null
}

export interface SoundcloudVisual {
    urn: string
    entry_time: number
    visual_url: string
}

export interface SoundcloudCreatorSubscription {
    product: {
        id: string
    }
}

export interface SoundcloudUserFilter extends SoundcloudFilter {
    "filter.place"?: string
}

export type ApiError = {
	code: number;
	message: string;
	link: string;
	status: string;
	errors: string[];
	error: string | null;
};
