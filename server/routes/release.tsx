import { ErrorMessageBox } from '@/server/components/MessageBox.tsx';
import { Release } from '@/server/components/Release.tsx';
import ReleaseLookup from '@/server/components/ReleaseLookup.tsx';
import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';
import { ReleaseSeeder } from '@/server/islands/ReleaseSeeder.tsx';

import { codeUrl, musicbrainzTargetServer } from '@/config.ts';
import { CombinedReleaseLookup } from '@/lookup.ts';
import { resolveReleaseMbids } from '@/musicbrainz/mbid_mapping.ts';
import { defaultProviderPreferences } from '@/providers/mod.ts';
import { createReleasePermalink } from '@/server/permalink.ts';
import { extractReleaseLookupState } from '@/server/state.ts';
import { LookupError } from '@/utils/errors.ts';
import { filterErrorEntries } from '@/utils/record.ts';
import { Head } from 'fresh/runtime.ts';
import { defineRoute } from 'fresh/server.ts';
import { getLogger } from 'std/log/get_logger.ts';
import { join } from 'std/url/join.ts';

import type {
	GTIN,
	MergedHarmonyRelease,
	ProviderInfo,
	ProviderReleaseMap,
	ReleaseOptions,
} from '@/harmonizer/types.ts';

const seederTargetUrl = join(musicbrainzTargetServer, 'release/add');

export default defineRoute(async (req, ctx) => {
	const seederSourceUrl = ctx.url;
	const errors: Error[] = [];
	let release: MergedHarmonyRelease | undefined;
	let releaseMap: ProviderReleaseMap | undefined;
	let enabledProviders: Set<string> | undefined = undefined;
	let gtinInput: GTIN = '', urlInput = '', regionsInput: string[] = [];
	let existingMBID: string | undefined;

	try {
		const {
			gtin,
			urls,
			regions,
			providerIds,
			providers,
			snapshotMaxTimestamp,
			templateProviders,
		} = extractReleaseLookupState(seederSourceUrl, req.headers);
		const options: ReleaseOptions = {
			withSeparateMedia: true,
			withAllTrackArtists: true,
			withISRC: true,
			regions,
			providers,
			snapshotMaxTimestamp,
			templateProviders,
		};
		enabledProviders = providers;
		gtinInput = gtin ?? '';
		urlInput = urls[0]?.href;
		regionsInput = [...(regions ?? [])];

		if (providerIds.length || urls.length || gtin && providers?.size) {
			const lookup = new CombinedReleaseLookup({ gtin, providerIds, urls }, options);
			releaseMap = filterErrorEntries(await lookup.getCompleteProviderReleaseMapping());
			release = await lookup.getMergedRelease({
				prefer: defaultProviderPreferences,
			});

			// Resolving MBIDs is expensive, skip this step for fast permalinks.
			if (snapshotMaxTimestamp === undefined) {
				await resolveReleaseMbids(release);
			}

			const mbInfo = release.info.providers.find((provider) => provider.name === 'MusicBrainz');
			if (mbInfo && !mbInfo.isTemplate) {
				existingMBID = mbInfo.id;
				release.info.messages.push({
					text: `Release with GTIN ${
						release.gtin || '[unknown]'
					} already exists on MusicBrainz ([show actions](release/actions?release_mbid=${mbInfo.id}))`,
					type: 'info',
				});
			}

			// Warn about potential duplicate releases on MB which already have some of the external links.
			for (const [mbid, providerInfo] of groupProvidersByLinkedRelease(release.info.providers)) {
				const mbUrl = join(musicbrainzTargetServer, 'release', mbid);
				const providerList = providerInfo.map((provider) => provider.name).join(' / ');
				let dupeWarning = `Release [${mbid}](${mbUrl}) is already linked to this ${providerList} release`;
				const dupeIsPartOfLookup = mbInfo?.id === mbid;
				if (!dupeIsPartOfLookup) {
					// Suggest to add the MBID of the potential duplicate to the current lookup (if it was not done already).
					const dupeLookupUrl = new URL(seederSourceUrl);
					dupeLookupUrl.searchParams.set('musicbrainz', mbid);
					dupeWarning += ` ([add to lookup](${dupeLookupUrl}))`;
				}
				release.info.messages.push({
					text: dupeWarning,
					type: dupeIsPartOfLookup ? 'info' : 'warning',
				});
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
				{errors.map((error, index) => <ErrorMessageBox error={error} currentUrl={ctx.url} key={index} />)}
				{release && <Release release={release} releaseMap={releaseMap} />}
				{release && (
					<div class='row'>
						<ReleaseSeeder
							release={release}
							projectUrl={codeUrl.href}
							sourceUrl={seederSourceUrl.href}
							targetUrl={seederTargetUrl.href}
						/>
						{existingMBID && (
							<ReleaseSeeder
								release={release}
								projectUrl={codeUrl.href}
								sourceUrl={seederSourceUrl.href}
								targetUrl={join(musicbrainzTargetServer, 'release', existingMBID, 'edit').href}
							/>
						)}
					</div>
				)}
			</main>
		</>
	);
});

function groupProvidersByLinkedRelease(providers: ProviderInfo[]): Map<string, ProviderInfo[]> {
	const providersByLinkedReleaseMbid = new Map<string, ProviderInfo[]>();
	for (const providerInfo of providers) {
		const { linkedReleases } = providerInfo;
		if (linkedReleases?.length) {
			for (const mbid of linkedReleases) {
				let list = providersByLinkedReleaseMbid.get(mbid);
				if (!list) {
					list = [];
					providersByLinkedReleaseMbid.set(mbid, list);
				}
				list.push(providerInfo);
			}
		}
	}
	return providersByLinkedReleaseMbid;
}
