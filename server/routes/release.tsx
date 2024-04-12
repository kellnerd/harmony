import Footer from '@/server/components/Footer.tsx';
import { MessageBox } from '@/server/components/MessageBox.tsx';
import { Release } from '@/server/components/Release.tsx';
import ReleaseLookup from '@/server/components/ReleaseLookup.tsx';
import { ReleaseSeeder } from '@/server/components/ReleaseSeeder.tsx';

import { getMergedReleaseByGTIN, getMergedReleaseByUrl } from '@/lookup.ts';
import { allProviderSimpleNames } from '@/providers/mod.ts';
import { assertCountryCode } from '@/utils/regions.ts';
import { Head } from 'fresh/runtime.ts';
import { defineRoute } from 'fresh/server.ts';

import type { HarmonyRelease, ReleaseOptions } from '@/harmonizer/types.ts';
import type { ProviderError } from '@/utils/errors.ts';

export default defineRoute(async (req, ctx) => {
	const url = new URL(req.url);
	const { searchParams } = url;
	const gtin = searchParams.get('gtin');
	const externalUrl = searchParams.get('url'); // TODO: handle multiple values
	const regions = searchParams.getAll('region');

	const requestedProviders = new Set<string>();
	for (const [name, value] of searchParams) {
		if (allProviderSimpleNames.has(name)) {
			requestedProviders.add(name);
		}
	}

	const errors: Error[] = [];
	const options: ReleaseOptions = {
		withSeparateMedia: true,
		withAllTrackArtists: true,
		regions: regions.length ? regions : ['GB', 'US', 'DE', 'JP'],
		providers: requestedProviders.size ? requestedProviders : undefined,
	};

	// Only set seeder URL (used for permalinks) in production servers.
	const seederUrl = ctx.config.dev ? undefined : url;

	let release: HarmonyRelease | undefined;
	try {
		for (const countryCode of options.regions!) {
			assertCountryCode(countryCode);
		}
		if (gtin) {
			release = await getMergedReleaseByGTIN(gtin, options);
		} else if (externalUrl) {
			release = await getMergedReleaseByUrl(new URL(externalUrl), options);
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
				<ReleaseLookup gtin={gtin} externalUrl={externalUrl} />
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
