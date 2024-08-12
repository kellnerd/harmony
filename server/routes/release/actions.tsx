import { ArtistCredit } from '@/server/components/ArtistCredit.tsx';
import { CoverImage } from '@/server/components/CoverImage.tsx';
import { type EntityWithUrlRels, LinkWithMusicBrainz } from '@/server/components/LinkWithMusicBrainz.tsx';
import { MagicISRC } from '@/server/components/ISRCSubmission.tsx';
import { MessageBox } from '@/server/components/MessageBox.tsx';
import { ProviderList } from '@/server/components/ProviderList.tsx';
import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';

import { CombinedReleaseLookup } from '@/lookup.ts';
import { deduplicateEntities } from '@/harmonizer/deduplicate.ts';
import type { ArtistCreditName, Artwork, HarmonyRelease, ProviderInfo, ReleaseOptions } from '@/harmonizer/types.ts';
import { MB } from '@/musicbrainz/api_client.ts';
import { providers as providerRegistry } from '@/providers/mod.ts';
import { musicbrainzBaseUrl } from '@/server/config.ts';
import { extractReleaseLookupState } from '@/server/state.ts';
import { LookupError, ProviderError } from '@/utils/errors.ts';
import { isDefined } from '@/utils/predicate.ts';
import { filterErrorEntries } from '@/utils/record.ts';
import { Head } from 'fresh/runtime.ts';
import { defineRoute } from 'fresh/server.ts';
import { getLogger } from 'std/log/get_logger.ts';
import { join } from 'std/url/join.ts';

export default defineRoute(async (req, ctx) => {
	const errors: Error[] = [];
	let release: HarmonyRelease | undefined = undefined;
	let releaseMbid: string | undefined;
	let releaseUrl: URL | undefined;
	let isrcProvider: ProviderInfo | undefined;
	let allArtists: ArtistCreditName[] = [];
	let mbArtists: EntityWithUrlRels[] = [];
	let allImages: Artwork[] = [];

	try {
		releaseMbid = ctx.url.searchParams.get('release_mbid') ?? undefined;
		if (!releaseMbid) {
			throw new Error('Required query parameter `release_mbid` is missing');
		}
		releaseUrl = join(musicbrainzBaseUrl, 'release', releaseMbid);

		const {
			gtin,
			urls,
			regions,
			providerIds,
			providers,
			snapshotMaxTimestamp,
		} = extractReleaseLookupState(ctx.url);
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
			const uniqueResources = new Set<string>(mbRelease.relations.map((rel) => rel.url.resource));
			for (const resource of uniqueResources) {
				if (providerRegistry.findByUrl(resource)) {
					urls.push(new URL(resource));
				}
			}
		}

		// Add MB release to the combined lookup to match external IDs with MBIDs.
		providerIds.push(['MusicBrainz', releaseMbid]);

		const lookup = new CombinedReleaseLookup({ urls, gtin, providerIds }, options);
		release = await lookup.getMergedRelease();

		// Combine and deduplicate release and track artists.
		const trackArtists = release.media
			.flatMap((medium) => medium.tracklist)
			.flatMap((track) => track.artists)
			.filter(isDefined);
		allArtists = deduplicateEntities(release.artists.concat(trackArtists));
		const mbArtistBrowseResult = await MB.get('artist', { release: releaseMbid, inc: 'url-rels' });
		mbArtists = mbArtistBrowseResult.artists;
		const providerReleaseMap = filterErrorEntries(await lookup.getCompleteProviderReleaseMapping());
		allImages = Object.entries(providerReleaseMap).flatMap(([provider, release]) =>
			release.images?.map((image) => ({ ...image, provider })) ?? []
		);

		const { info } = release;
		const isrcSource = info.sourceMap?.isrc;
		isrcProvider = info.providers.find((provider) => provider.name === isrcSource);
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
					<div class='message'>
						<SpriteIcon name='brand-metabrainz' />
						<p>
							<a href={releaseUrl.href}>
								Open in MusicBrainz
							</a>
						</p>
					</div>
				)}
				{release && isrcProvider && (
					<div class='message'>
						<SpriteIcon name='disc' />
						<div>
							<p>
								Submit ISRCs from {isrcProvider.name} to MusicBrainz:{' '}
								<MagicISRC release={release} targetMbid={releaseMbid!} />
							</p>
							<p>
								<small>Submit ISRCs from {isrcProvider.url.href} to {releaseUrl!.href}</small>
							</p>
						</div>
					</div>
				)}
				{releaseUrl &&
					allArtists.map((artist) => (
						<LinkWithMusicBrainz
							entity={artist}
							entityType='artist'
							sourceEntityUrl={releaseUrl}
							entityCache={mbArtists}
						/>
					))}
				{release?.labels?.map((label) => (
					<LinkWithMusicBrainz entity={label} entityType='label' sourceEntityUrl={releaseUrl!} />
				))}
				{releaseUrl && (
					<div class='message'>
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
				{allImages.map((artwork) => <CoverImage artwork={artwork} />)}
			</main>
		</>
	);
});
