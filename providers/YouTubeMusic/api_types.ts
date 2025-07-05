type TrackingParams = { trackingParams: string };

type APIResponse = {
	responseContext?: {
		serviceTrackingParams: unknown[];
	};
} & TrackingParams;

export type Album = {
	contents?: Renderer<'TwoColumnBrowseResults'>;
	microformat: Renderer<'MicroformatData'>;
	background?: Renderer<'MusicThumbnail'>;
} & APIResponse;

export type Playlist = {
	contents: Renderer<'TwoColumnBrowseResults'>;
} & APIResponse;

export type Credits = {
	onResponseReceivedActions: {
		clickTrackingParams: string;
		openPopupAction: {
			popup: Renderer<'DismissableDialog'>;
			popupType: string;
		};
	}[];
} & APIResponse;

export type SearchResult = {
	contents: Renderer<'TabbedSearchResults'>;
} & APIResponse;

type Icon = { iconType: string };

type Thumbnail = {
	thumbnails: { url: string; width: number; height: number }[];
	thumbnailCrop: string;
	thumbnailScale: string;
} & TrackingParams;

export type BrowseEndpoint = {
	browseEndpoint: {
		browseId: string;
		params: string;
		browseEndpointContextSupportedConfigs: {
			browseEndpointContextMusicConfig: { pageType: string };
		};
	};
};

export type WatchEndpoint = {
	watchEndpoint: {
		videoId: string;
		playlistId?: string;
		watchEndpointMusicSupportedConfigs?: {
			musicVideoType?: string;
		};
	};
};

export type QueueAddEndpoint = {
	queueAddEndpoint: unknown;
};

export type ModalEndpoint = {
	modalEndpoint: unknown;
};

export type Nodes = {
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MicroformatData.ts */
	MicroformatData: {
		urlCanonical: string;
	};
	DismissableDialog: unknown;
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/Tab.ts */
	Tab: {
		title: string;
		selected: boolean;
		content: Renderer<'SectionList'>;
		tabIdentifier: string;
	} & TrackingParams;
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/SectionList.ts */
	SectionList: {
		contents: (
			| Renderer<'ItemSection'>
			| Renderer<'MusicCardShelf'>
			| Renderer<'MusicShelf'>
			| Renderer<'MusicPlaylistShelf'>
			| Renderer<'MusicResponsiveHeader'>
		)[];
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/ItemSection.ts */
	ItemSection: {
		contents: unknown[];
	} & TrackingParams;
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicShelf.ts */
	MusicShelf: {
		title: string;
		contents: Renderer<'MusicResponsiveListItem'>[];
		bottomText: YTText;
		bottomEndpoint: unknown;
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicPlaylistShelf.ts */
	MusicPlaylistShelf: {
		contents: Renderer<'MusicResponsiveListItem'>[];
		collapsedItemCount: number;
		targetId: string;
	} & TrackingParams;
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicCardShelf.ts */
	MusicCardShelf: {
		thumbnail: Renderer<'MusicThumbnail'>;
		title: YTText;
		subtitle: YTText;
		buttons: unknown[];
		menu: Renderer<'Menu'>;
		onTap: unknown;
		header: Renderer<'MusicCardShelfHeaderBasic'>;
		endIcon: Icon;
		thumbnailOverlay: Renderer<'MusicItemThumbnailOverlay'>;
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicThumbnail.ts */
	MusicThumbnail: {
		thumbnail: Thumbnail;
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/menus/Menu.ts */
	Menu: {
		items: (Renderer<'MenuNavigationItem'> | Renderer<'MenuServiceItem'>)[];
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/menus/MenuNavigationItem.ts */
	MenuNavigationItem: {
		text: YTText;
		icon: Icon;
		navigationEndpoint: BrowseEndpoint | ModalEndpoint | QueueAddEndpoint | WatchEndpoint;
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/menus/MenuServiceItem.ts */
	MenuServiceItem: unknown;
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicCardShelfHeaderBasic.ts */
	MusicCardShelfHeaderBasic: unknown;
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicItemThumbnailOverlay.ts */
	MusicItemThumbnailOverlay: unknown;
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicResponsiveListItem.ts */
	MusicResponsiveListItem: {
		thumbnail: Renderer<'MusicThumbnail'>;
		overlay: Renderer<'MusicItemThumbnailOverlay'>;
		flexColumns: Renderer<'MusicResponsiveListItemFlexColumn'>[];
		fixedColumns?: Renderer<'MusicResponsiveListItemFixedColumn'>[];
		menu: Renderer<'Menu'>;
		badges: Renderer<'MusicInlineBadge'>[];
		flexColumnDisplayStyle: string;
		navigationEndpoint: BrowseEndpoint;
		index?: YTText;
	} & TrackingParams;
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicResponsiveHeader.ts */
	MusicResponsiveHeader: {
		thumbnail?: Renderer<'MusicThumbnail'>;
		buttons?: unknown[];
		title: YTText;
		subtitle: YTText;
		straplineTextOne: YTText;
		straplineThumbnail: Renderer<'MusicThumbnail'>;
		subtitleBadge: Renderer<'MusicInlineBadge'>[];
		description: Renderer<'MusicDescriptionShelf'>;
		secondSubtitle: YTText;
	};
	MusicResponsiveListItemFixedColumn: {
		text: YTText;
		displayPriority?: string;
		size?: string;
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicResponsiveListItemFlexColumn.ts */
	MusicResponsiveListItemFlexColumn: {
		text: YTText;
		displayPriority: string;
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicDescriptionShelf.ts */
	MusicDescriptionShelf: {
		description: YTText;
		straplineBadge?: Renderer<'MusicInlineBadge'>[];
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/MusicInlineBadge.ts */
	MusicInlineBadge: {
		icon: Icon;
		accessibilityData: unknown[];
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/TabbedSearchResults.ts */
	TabbedSearchResults: {
		tabs: Renderer<'Tab'>[];
	};
	/** @see https://github.com/LuanRT/YouTube.js/blob/v14.0.0/src/parser/classes/TwoColumnBrowseResults.ts */
	TwoColumnBrowseResults: {
		secondaryContents: Renderer<'SectionList'>;
		tabs: Renderer<'Tab'>[];
	};
};

type RendererName<T extends string> = `${Uncapitalize<T>}Renderer`;

export type Renderer<Node extends keyof Nodes> = { [K in RendererName<Node>]: Nodes[Node] };

type YTText = { runs: TextRun[]; accessibility?: { accessibilityData?: unknown } };

export type TextRun = { text: string; navigationEndpoint?: BrowseEndpoint | WatchEndpoint };
