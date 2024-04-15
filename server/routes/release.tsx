import Footer from '@/server/components/Footer.tsx';
import { MessageBox } from '@/server/components/MessageBox.tsx';
import { Release } from '@/server/components/Release.tsx';
import ReleaseLookup from '@/server/components/ReleaseLookup.tsx';
import { ReleaseSeeder } from '@/server/components/ReleaseSeeder.tsx';

import { CombinedReleaseLookup } from '@/lookup.ts';
import { defaultProviderPreferences } from '@/providers/mod.ts';
import { extractReleaseLookupState } from '@/server/state.ts';
import { Head } from 'fresh/runtime.ts';
import { defineRoute } from 'fresh/server.ts';

import type { HarmonyRelease, ReleaseOptions } from '@/harmonizer/types.ts';
import type { ProviderError } from '@/utils/errors.ts';

export default defineRoute(async (req, ctx) => {
	const routeUrl = new URL(req.url);
	// Only set seeder URL (used for permalinks) in production servers.
	const seederUrl = ctx.config.dev ? undefined : routeUrl;

	const { gtin, urls, regions, providerIds, providers } = extractReleaseLookupState(routeUrl);
	const options: ReleaseOptions = {
		withSeparateMedia: true,
		withAllTrackArtists: true,
		regions,
		providers,
	};

	const errors: Error[] = [];
	let release: HarmonyRelease | undefined;
	try {
		if (gtin || providerIds.length || urls.length) {
			const lookup = new CombinedReleaseLookup({ gtin, providerIds, urls }, options);
			release = await lookup.getMergedRelease(defaultProviderPreferences);
		}
	} catch (error) {
		if (ctx.config.dev) {
			// Show more details during development.
			console.error(error);
		}
		if (error instanceof AggregateError) {
			errors.push(error, ...error.errors);
		} else if (error instanceof Error) {
			errors.push(error);
		}
	}

	return (
		<>
			<Head>
				<title>{release?.title ?? 'Release Lookup'} &ndash; Harmony</title>
			</Head>
			<main>
				<h2 class='center'>Release Lookup</h2>
				<ReleaseLookup gtin={gtin} externalUrl={urls[0]?.href} regions={[...(regions ?? [])]} />
				{errors.map((error) => (
					<MessageBox
						message={{
							provider: (error as ProviderError).providerName,
							text: error.message,
							type: 'error',
						}}
					/>
				))}
				{release && <Release release={release} />}
				{release && <ReleaseSeeder release={release} seederUrl={seederUrl} />}
			</main>
			<Footer />
		</>
	);
});
