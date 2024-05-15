import type { EpisodeData, Release } from './json_types.ts';
import { mediumFormatMap, twoSidedFormats } from './mapping.ts';
import type { EntityId, HarmonyMedium, HarmonyRelease } from '@/harmonizer/types.ts';
import { DurationPrecision, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { parseGermanDate } from '@/utils/date.ts';
import { ProviderError } from '@/utils/errors.ts';
import {
	extractAnchorTag,
	extractAnchorTags,
	extractAttribute,
	extractDivsWithClass,
	extractDivWithClass,
	extractSpanWithClass,
	toText,
} from '@/utils/html.ts';
import { similarNames } from '@/utils/similarity.ts';
import { parseDuration } from '@/utils/time.ts';

export default class HörspielforscherProvider extends MetadataProvider {
	readonly name = 'Hörspielforscher';

	get internalName() {
		return 'hspforscher';
	}

	readonly supportedUrls = new URLPattern({
		hostname: 'hoerspielforscher.de',
		pathname: '/kartei/:type(hoerspiel|label|person)',
		search: 'detail=:id(\\d+){&*}?',
	});

	readonly entityTypeMap = {
		artist: 'person',
		label: 'label',
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

	convertRawRelease(rawRelease: Release): HarmonyRelease {
		this.id = rawRelease.id.toString();

		const { artist, coverUrl, label, info } = rawRelease;
		const release: HarmonyRelease = {
			title: rawRelease.title,
			artists: artist
				? [{
					name: artist,
					externalIds: this.convertUrlToExternalId(rawRelease.artistUrl),
				}]
				: [],
			labels: label
				? [{
					name: label.text,
					externalIds: this.convertUrlToExternalId(label.href),
					catalogNumber: info['Katalognummer'],
				}]
				: undefined,
			releaseDate: parseGermanDate(info['Veröffentlichung']),
			media: this.makeMedia(rawRelease),
			status: 'Official',
			externalLinks: [{
				url: this.provider.constructUrl({
					type: 'hoerspiel',
					id: this.id,
				}),
				types: ['discography page'],
			}],
			images: coverUrl
				? [{
					url: new URL(coverUrl),
					types: ['front'],
				}]
				: undefined,
			info: this.generateReleaseInfo(),
		};

		return release;
	}

	convertUrlToExternalId(url: string | undefined) {
		if (!url) return;
		const entityId = this.provider.extractEntityFromUrl(new URL(url));
		return this.provider.makeExternalIds(entityId!);
	}

	makeMedia(rawRelease: Release): HarmonyMedium[] {
		const { title, info, duration, chapters } = rawRelease;
		const label = rawRelease.label?.text;

		// Try to extract medium count from description.
		let mediumCount = 1;
		if (label) {
			const formatDescription = rawRelease.description.replace(`${title} - ${label} `, '');
			const formatCount = parseInt(formatDescription, 10);
			if (!isNaN(formatCount)) {
				mediumCount = formatCount;
			} else if (formatDescription.startsWith('Doppel')) {
				mediumCount = 2;
			}
		}

		// Create media with empty track lists, using the same format for each.
		const format = mediumFormatMap[info['Format']];
		const media: HarmonyMedium[] = new Array(mediumCount).fill(null).map((_, index) => ({
			number: index + 1,
			tracklist: [],
			format,
		}));

		// Use chapter titles as medium titles if their counts match.
		if (chapters.length > 1 && chapters.length === media.length) {
			media.forEach((medium, index) => medium.title = chapters[index]);
		}

		// For two-sided formats, the given medium/side durations are equivalent to track durations.
		const mediumDurations = duration?.match(/\(.+\)/)?.[0];
		const isTwoSidedMedium = format && twoSidedFormats.has(format);
		let trackDurations: string[] = [];
		if (mediumDurations && isTwoSidedMedium) {
			for (const duration of mediumDurations.matchAll(/\b\d{1,2}:\d{1,2}\b/g)) {
				trackDurations.push(duration[0]);
			}
		}

		// Populate track lists of two sided media for which we know the track counts.
		if (isTwoSidedMedium) {
			// Distrust durations if we do not have the correct amount of them.
			const totalTrackCount = 2 * media.length;
			if (trackDurations.length !== totalTrackCount) {
				trackDurations = new Array(totalTrackCount).fill(undefined);
			}

			// Use letters as side/track numbers.
			const firstSideCodePoint = 'A'.codePointAt(0)!;

			// Prefer the chapter title (without episode number) over the release title for track titles.
			let trackBaseTitle = title;
			if (chapters.length === 1) {
				trackBaseTitle = chapters[0];
			}

			trackDurations.forEach((duration, trackIndex) => {
				const mediumIndex = Math.floor(trackIndex / 2);
				const medium = media[mediumIndex];

				let trackTitle: string;
				if (medium.title) {
					trackTitle = `${medium.title}, Teil ${trackIndex % 2 + 1}`;
				} else {
					trackTitle = `${trackBaseTitle}, Teil ${trackIndex + 1}`;
				}

				medium.tracklist.push({
					number: String.fromCodePoint(firstSideCodePoint + trackIndex),
					title: trackTitle,
					length: duration ? parseDuration(duration) * 1000 : undefined,
				});
			});
		}

		return media;
	}

	extractRawRelease(data: EpisodeData): Release {
		const { main, subsection } = data;
		const releaseInfo = extractDivWithClass(main, 'release-info');
		if (!releaseInfo) {
			throw new ProviderError(this.provider.name, 'Failed to extract release info');
		}

		const release: Release = {
			id: data.id,
			title: extractSpanWithClass(releaseInfo, 'title')!,
			description: data.title,
			artist: extractSpanWithClass(releaseInfo, 'artist')?.trim() || undefined,
			coverUrl: extractAttribute(main, 'img', 'src'),
			chapters: Array.from(extractDivsWithClass(subsection, 'chapter')),
			info: {},
		};

		const labelSpan = extractSpanWithClass(releaseInfo, 'catalog');
		if (labelSpan) {
			release.label = extractAnchorTag(labelSpan);
		}

		// Extract durations and other key-value pairs from the main info block.
		for (const infoDiv of extractDivsWithClass(main, 'info-line')) {
			if (infoDiv.includes('Spielzeit')) {
				release.duration = toText(infoDiv).split(/:\s+/)[1];
			} else {
				for (const infoEntry of infoDiv.split(/<br>|•/i).map(toText)) {
					// Split into key and value.
					const infoMatch = infoEntry.match(/(.+?):\s+(.+)/);
					if (infoMatch) {
						const key = infoMatch[1].trim();
						release.info[key] = infoMatch[2].trim();
					}
				}
			}
		}

		// Try to find an URL for the credited artist (which was text only).
		artistUrlSearch: if (release.artist) {
			for (const crewDiv of extractDivsWithClass(subsection, 'crew-set')) {
				for (const person of extractAnchorTags(crewDiv)) {
					if (similarNames(person.text, release.artist)) {
						release.artistUrl = person.href;
						break artistUrlSearch;
					}
				}
			}
		}

		return release;
	}
}
