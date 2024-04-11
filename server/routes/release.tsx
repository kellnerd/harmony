import Footer from '@/server/components/Footer.tsx';
import { MessageBox } from '@/server/components/MessageBox.tsx';
import { Release } from '@/server/components/Release.tsx';
import ReleaseLookup from '@/server/components/ReleaseLookup.tsx';
import { ReleaseSeeder } from '@/server/components/ReleaseSeeder.tsx';

import { getMergedReleaseByGTIN, getMergedReleaseByUrl } from '@/lookup.ts';
import { Head } from 'fresh/runtime.ts';
import { Handlers, PageProps } from 'fresh/server.ts';

import type { GTIN, HarmonyRelease, ReleaseOptions } from '@/harmonizer/types.ts';
import type { ProviderError } from '@/utils/errors.ts';

type Data = {
	errors: Error[];
	release?: HarmonyRelease;
	gtin: GTIN | null;
	externalUrl: string | null;
};

const DEV = !Deno.env.get('DENO_DEPLOYMENT_ID');

export const handler: Handlers<Data> = {
	async GET(req, ctx) {
		const url = new URL(req.url);
		const gtin = url.searchParams.get('gtin');
		const externalUrl = url.searchParams.get('url'); // TODO: handle multiple values

		const errors: Error[] = [];
		const options: ReleaseOptions = {
			withSeparateMedia: true,
			withAllTrackArtists: true,
			regions: ['GB', 'US', 'DE', 'JP'],
		};

		let release: HarmonyRelease | undefined;
		try {
			if (gtin) {
				release = await getMergedReleaseByGTIN(gtin, options);
			} else if (externalUrl) {
				release = await getMergedReleaseByUrl(new URL(externalUrl), options);
			}
		} catch (error) {
			if (DEV) {
				// Show more details during development.
				throw error;
			}
			if (error instanceof AggregateError) {
				errors.push(error, ...error.errors);
			} else if (error instanceof Error) {
				errors.push(error);
			}
		}

		return ctx.render({ errors, release, gtin, externalUrl });
	},
};

export default function Page({ data }: PageProps<Data>) {
	const { errors, release, gtin, externalUrl } = data;
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
				{release && <ReleaseSeeder release={release} />}
			</main>
			<Footer />
		</>
	);
}
