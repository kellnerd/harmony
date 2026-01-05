import { ArtistCredit } from '@/server/components/ArtistCredit.tsx';
import { CoverImage } from '@/server/components/CoverImage.tsx';
import { ISRCSubmission } from '@/server/components/ISRCSubmission.tsx';
import { LinkWithMusicBrainz } from '@/server/components/LinkWithMusicBrainz.tsx';
import { MBIDInput } from '@/server/components/MBIDInput.tsx';
import { MessageBox } from '@/server/components/MessageBox.tsx';
import { ProviderList } from '@/server/components/ProviderList.tsx';
import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';

import { musicbrainzTargetServer } from '@/config.ts';
import { deduplicateEntities } from '@/harmonizer/deduplicate.ts';
import type {
	ArtistCreditName,
	Artwork,
	HarmonyRelease,
	ReleaseOptions,
	ResolvableEntity,
} from '@/harmonizer/types.ts';
import { CombinedReleaseLookup } from '@/lookup.ts';
import { MB } from '@/musicbrainz/api_client.ts';
import { extractMBID } from '@/musicbrainz/extract_mbid.ts';
import { variousArtists } from '@/musicbrainz/special_entities.ts';
import { providers as providerRegistry } from '@/providers/mod.ts';
import { extractReleaseLookupState } from '@/server/state.ts';
import { LookupError, ProviderError } from '@/utils/errors.ts';
import { isDefined } from '@/utils/predicate.ts';
import { filterErrorEntries } from '@/utils/record.ts';
import { Head } from 'fresh/runtime.ts';
import { defineRoute } from 'fresh/server.ts';
import { getLogger } from 'std/log/get_logger.ts';
import { join } from 'std/url/join.ts';
import type { EntityWithUrlRels } from '@/musicbrainz/edit_link.ts';

export default defineRoute(async (req, ctx) => {
	const errors: Error[] = [];
	let release: HarmonyRelease | undefined = undefined;
	let releaseMbid: string | undefined;
	let releaseUrl: URL | undefined;
	let allArtists: ArtistCreditName[] = [];
	let mbArtists: EntityWithUrlRels[] = [];
	let mbLabels: EntityWithUrlRels[] = [];
	let mbRecordings: EntityWithUrlRels[] = [];
	let allImages: Artwork[] = [];
	let allRecordings: ResolvableEntity[] = [];

	try {
		releaseMbid = ctx.url.searchParams.get('release_mbid') ?? undefined;
		if (releaseMbid) {
			releaseMbid = extractMBID(releaseMbid, ['release']);
			releaseUrl = join(musicbrainzTargetServer, 'release', releaseMbid);

			const {
				gtin,
				urls,
				regions,
				providerIds,
				providers,
				snapshotMaxTimestamp,
			} = extractReleaseLookupState(ctx.url, req.headers);
			const options: ReleaseOptions = {
				withSeparateMedia: true,
				withISRC: true,
				regions,
				providers,
				snapshotMaxTimestamp,
			};

			// If only a release MBID is given, we have to get the URLs of the potential sources from the MB release itself.
			if (!(providerIds.length || urls.length || gtin && providers?.size)) {
				const mbRelease = await MB.lookup('release', releaseMbid, { inc: ['url-rels'] });
				// Ended URLs usually can no longer be looked up, or worse, their tracklist has been changed.
				const validUrlRels = mbRelease.relations.filter((rel) => !rel.ended);
				const uniqueResources = new Set<string>(validUrlRels.map((rel) => rel.url.resource));
				for (const resource of uniqueResources) {
					const matchingProvider = providerRegistry.findByUrl(resource);
					// Use all supported URLs or only those from requested providers if these are specified.
					if (matchingProvider && (!providers?.size || providers.has(matchingProvider.internalName))) {
						urls.push(new URL(resource));
					}
				}
			}

			// Add MB release to the combined lookup to match external IDs with MBIDs.
			providerIds.push(['MusicBrainz', releaseMbid]);

			const lookup = new CombinedReleaseLookup({ urls, gtin, providerIds }, options);
			// Since the release has already been imported and has MBIDs, prefer MB data as merge target.
			release = await lookup.getMergedRelease(['MusicBrainz']);

			const providerReleaseMap = filterErrorEntries(await lookup.getCompleteProviderReleaseMapping());
			allImages = Object.entries(providerReleaseMap).flatMap(([provider, release]) =>
				release.images?.map((image) => ({ ...image, provider })) ?? []
			);

			const allTracks = release.media.flatMap((medium) => medium.tracklist);

			// Fallback to track title, Harmony recordings are usually unnamed.
			allRecordings = allTracks.map((track) => ({ name: track.title, ...track.recording }));

			// Combine and deduplicate release and track artists.
			// Drop special purpose artist Various Artists, which can't be edited on MB (by regular users).
			const trackArtists = allTracks
				.flatMap((track) => track.artists)
				.filter(isDefined);
			allArtists = deduplicateEntities(release.artists.concat(trackArtists))
				.filter((artist) => artist.mbid !== variousArtists.mbid);

			// Load URL relationships for related artists, recordings and labels of the release.
			// These will be used to skip suggestions to seed external links which already exist.
			// For recordings it also includes ISRCs to determine if there are new ones to submit.
			const mbArtistBrowseResult = await MB.get('artist', { release: releaseMbid, inc: 'url-rels', limit: 100 });
			mbArtists = mbArtistBrowseResult.artists;
			const mbRecordingBrowseResult = await MB.get('recording', {
				release: releaseMbid,
				inc: 'url-rels+isrcs',
				limit: 100,
			});
			mbRecordings = mbRecordingBrowseResult.recordings;
			// Labels often have no external links which could be linked, save pointless API call.
			if (release.labels?.some((label) => label.externalIds?.length)) {
				const mbLabelBrowseResult = await MB.get('label', { release: releaseMbid, inc: 'url-rels' });
				mbLabels = mbLabelBrowseResult.labels;
			}
		}
	} catch (error) {
		if (error instanceof AggregateError) {
			errors.push(error, ...error.errors);
		} else if (error instanceof Error) {
			errors.push(error);
		}
		const log = getLogger('harmony.server');
		for (const error of errors) {
			// Log details for all unexpected errors (caused by bugs or wrong user inputs).
			// Skip our own error classes and redundant `AggregateError` wrappers (their errors will be handled one by one).
			if (!(error instanceof LookupError || error instanceof AggregateError)) {
				log.info(req.url);
				log.error(error);
			}
		}
	}

	const title = release?.title ?? 'Release Actions';
	return (
		<>
			<Head>
				<title>{title} &ndash; Harmony</title>
				<meta property='og:title' content={title} />
			</Head>
			<main>
				{release && (
					<>
						<h2 class='release-title'>{release.title}</h2>
						<div class='release-artist'>
							by <ArtistCredit artists={release.artists} />
						</div>
						<ProviderList providers={release.info.providers} />
					</>
				)}
				<h2>Release Actions</h2>
				{!release && (
					<form>
						<div class='row'>
							<MBIDInput name='release_mbid' placeholder='MusicBrainz release URL or MBID' value={releaseMbid} />
							<input type='submit' value='Go!' />
						</div>
					</form>
				)}
				{errors.map((error) => (
					<MessageBox
						message={{
							provider: (error as ProviderError).providerName,
							text: error.message,
							type: 'error',
						}}
					/>
				))}
				{releaseUrl && (
					<div class='action'>
						<SpriteIcon name='brand-metabrainz' />
						<p>
							<a href={releaseUrl.href}>
								Open in MusicBrainz
							</a>
						</p>
					</div>
				)}
				{release && (
					<ISRCSubmission
						release={release}
						targetMbid={releaseMbid}
						recordingsCache={mbRecordings}
					/>
				)}
				{releaseUrl && (
					<LinkWithMusicBrainz
						entities={allArtists}
						entityType='artist'
						sourceEntityUrl={releaseUrl}
						entityCache={mbArtists}
					/>
				)}
				{releaseUrl && release?.labels && (
					<LinkWithMusicBrainz
						entities={release.labels}
						entityType='label'
						sourceEntityUrl={releaseUrl!}
						entityCache={mbLabels}
					/>
				)}
				{releaseUrl && (
					<div class='action'>
						<SpriteIcon name='photo-plus' />
						<div>
							<p>
								<a href={join(releaseUrl, 'add-cover-art').href}>
									Add cover art
								</a>
							</p>
						</div>
					</div>
				)}
				{allImages.map((artwork) => <CoverImage artwork={artwork} key={artwork.url} />)}
				{releaseUrl && (
					<LinkWithMusicBrainz
						entities={allRecordings}
						entityType='recording'
						sourceEntityUrl={releaseUrl}
						entityCache={mbRecordings}
					/>
				)}
			</main>
		</>
	);
});
