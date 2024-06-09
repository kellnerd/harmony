import { MessageBox } from '@/server/components/MessageBox.tsx';
import { Release } from '@/server/components/Release.tsx';
import ReleaseLookup from '@/server/components/ReleaseLookup.tsx';
import { ReleaseSeeder } from '@/server/components/ReleaseSeeder.tsx';
import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';

import { CombinedReleaseLookup } from '@/lookup.ts';
import { resolveReleaseMbids } from '@/musicbrainz/mbid_mapping.ts';
import { defaultProviderPreferences } from '@/providers/mod.ts';
import { codeUrl, musicbrainzBaseUrl } from '@/server/config.ts';
import { createReleasePermalink, extractReleaseLookupState } from '@/server/state.ts';
import { filterErrorEntries } from '@/utils/record.ts';
import { Head } from 'fresh/runtime.ts';
import { defineRoute } from 'fresh/server.ts';
import { getLogger } from 'std/log/get_logger.ts';

import type { GTIN, HarmonyRelease, ProviderReleaseMap, ReleaseOptions } from '@/harmonizer/types.ts';
import { LookupError, type ProviderError } from '@/utils/errors.ts';

const seederTargetUrl = new URL('release/add', musicbrainzBaseUrl);

export default defineRoute(async (req, ctx) => {
	const seederSourceUrl = ctx.url;
	const errors: Error[] = [];
	let release: HarmonyRelease | undefined;
	let releaseMap: ProviderReleaseMap | undefined;
	let enabledProviders: Set<string> | undefined = undefined;
	let gtinInput: GTIN = '', urlInput = '', regionsInput: string[] = [];

	try {
		const { gtin, urls, regions, providerIds, providers, snapshotMaxTimestamp } = extractReleaseLookupState(ctx.url);
		const options: ReleaseOptions = {
			withSeparateMedia: true,
			withAllTrackArtists: true,
			withISRC: true,
			regions,
			providers,
			snapshotMaxTimestamp,
		};
		enabledProviders = providers;
		gtinInput = gtin ?? '';
		urlInput = urls[0]?.href;
		regionsInput = [...(regions ?? [])];

		if (providerIds.length || urls.length || gtin && providers?.size) {
			const lookup = new CombinedReleaseLookup({ gtin, providerIds, urls }, options);
			releaseMap = filterErrorEntries(await lookup.getCompleteProviderReleaseMapping());
			release = await lookup.getMergedRelease(defaultProviderPreferences);
			await resolveReleaseMbids(release);
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

	const title = release?.title ?? 'Release Lookup';
	return (
		<>
			<Head>
				<title>{title} &ndash; Harmony</title>
				<meta property='og:title' content={title} />
			</Head>
			<main>
				<h2 class='center'>Release Lookup</h2>
				<ReleaseLookup
					enabledProviders={enabledProviders}
					gtin={gtinInput}
					externalUrl={urlInput}
					regions={regionsInput}
				/>
				{release && (
					<p class='center'>
						<a href={createReleasePermalink(release.info, ctx.url).href}>
							<SpriteIcon name='link' />Permalink
						</a>
					</p>
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
				{release && <Release release={release} releaseMap={releaseMap} />}
				{release && (
					<ReleaseSeeder
						release={release}
						projectUrl={codeUrl}
						sourceUrl={seederSourceUrl}
						targetUrl={seederTargetUrl}
					/>
				)}
			</main>
		</>
	);
});
