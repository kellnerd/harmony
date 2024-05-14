import type { EpisodeData, Release } from './json_types.ts';
import type { EntityId, HarmonyRelease } from '@/harmonizer/types.ts';
import { DurationPrecision, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { ProviderError } from '@/utils/errors.ts';
import { extractAttribute, extractDivWithClass, extractSpanWithClass } from '@/utils/html.ts';

export default class HörspielforscherProvider extends MetadataProvider {
	readonly name = 'Hörspielforscher';

	get internalName() {
		return 'hspforscher';
	}

	readonly supportedUrls = new URLPattern({
		hostname: 'hoerspielforscher.de',
		pathname: '/kartei/:type(hoerspiel|person)',
		search: 'detail=:id(\\d+)&*',
	});

	readonly entityTypeMap = {
		artist: 'person',
		release: 'hoerspiel',
	};

	readonly releaseLookup = HörspielforscherReleaseLookup;

	readonly durationPrecision = DurationPrecision.SECONDS;

	readonly artworkQuality = 200;

	karteiBaseUrl = 'https://hoerspielforscher.de/kartei/';

	constructUrl(entity: EntityId): URL {
		const entityUrl = new URL(entity.type, this.karteiBaseUrl);
		entityUrl.searchParams.set('detail', entity.id);
		return entityUrl;
	}

	extractEntityFromUrl(url: URL): EntityId | undefined {
		const match = this.supportedUrls.exec(url);
		if (match) {
			const { type } = match.pathname.groups;
			const { id } = match.search.groups;
			if (type && id) {
				return {
					type,
					id,
				};
			}
		}
	}

	loadData<Data>(dataUrl: URL, maxTimestamp?: number) {
		return this.fetchJSON<Data>(dataUrl, { policy: { maxTimestamp } });
	}
}

export class HörspielforscherReleaseLookup extends ReleaseLookup<HörspielforscherProvider, Release> {
	constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	async getRawRelease(): Promise<Release> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}

		const episodeUrl = new URL('/kartei/loadEpisode', 'https://data.hoerspielforscher.de');
		episodeUrl.search = new URLSearchParams({
			id: this.lookup.value,
			dataRef: '2',
		}).toString();

		const { content, timestamp } = await this.provider.loadData<EpisodeData>(
			episodeUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.cacheTime = timestamp;

		return this.extractRawRelease(content);
	}

	convertRawRelease(rawRelease: Release): Promise<HarmonyRelease> {
		throw new Error('Method not implemented.');
	}

	extractRawRelease(data: EpisodeData): Release {
		const { main } = data;
		const releaseInfo = extractDivWithClass(main, 'release-info');
		if (!releaseInfo) {
			throw new ProviderError(this.provider.name, 'Failed to extract release info');
		}

		const release: Release = {
			title: extractSpanWithClass(releaseInfo, 'title')!,
			artist: extractSpanWithClass(releaseInfo, 'artist'),
			coverUrl: extractAttribute(main, 'img', 'src'),
		};

		console.debug(release);
		return release;
	}
}
