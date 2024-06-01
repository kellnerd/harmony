import { ArtistCredit } from '@/server/components/ArtistCredit.tsx';
import { MagicISRC } from '@/server/components/ISRCSubmission.tsx';
import { MessageBox } from '@/server/components/MessageBox.tsx';
import { ProviderList } from '@/server/components/ProviderList.tsx';

import { CombinedReleaseLookup } from '@/lookup.ts';
import type { HarmonyRelease, ReleaseOptions } from '@/harmonizer/types.ts';
import { MB } from '@/musicbrainz/api_client.ts';
import { providers as providerRegistry } from '@/providers/mod.ts';
import { musicbrainzBaseUrl } from '@/server/config.ts';
import { extractReleaseLookupState } from '@/server/state.ts';
import { LookupError, ProviderError } from '@/utils/errors.ts';
import { Head } from 'fresh/runtime.ts';
import { defineRoute } from 'fresh/server.ts';
import { getLogger } from 'std/log/get_logger.ts';

export default defineRoute(async (req, ctx) => {
	const errors: Error[] = [];
	let release: HarmonyRelease | undefined = undefined;
	let releaseMbid: string | undefined;

	try {
		releaseMbid = ctx.url.searchParams.get('release_mbid') ?? undefined;
		if (!releaseMbid) {
			throw new Error('Required query parameter `release_mbid` is missing');
		}

		const { gtin, urls, regions, providerIds, providers, snapshotMaxTimestamp } = extractReleaseLookupState(ctx.url);
		const options: ReleaseOptions = {
			withSeparateMedia: true,
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

		const lookup = new CombinedReleaseLookup({ urls, gtin, providerIds }, options);
		release = await lookup.getMergedRelease();
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
				{releaseMbid && (
					<p>
						<a href={new URL(`release/${releaseMbid}`, musicbrainzBaseUrl).href} target='_blank'>Open on MusicBrainz</a>
					</p>
				)}
				{release && <MagicISRC release={release} targetMbid={releaseMbid} />}
			</main>
		</>
	);
});
