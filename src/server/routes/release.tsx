import { MessageBox } from '../components/MessageBox.tsx';
import { Release } from '../components/Release.tsx';
import ReleaseLookup from '../components/ReleaseLookup.tsx';
import { ReleaseSeeder } from '../components/ReleaseSeeder.tsx';

import { getMergedReleaseByGTIN, getMergedReleaseByUrl } from '../../lookup.ts';
import { Head } from 'fresh/runtime.ts';
import { Handlers, PageProps } from 'fresh/server.ts';

import type { GTIN, HarmonyRelease, ReleaseOptions } from '../../harmonizer/types.ts';

type Data = {
	errors: Error[];
	release?: HarmonyRelease;
	gtin: GTIN | null;
	externalUrl: string | null;
};

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
			if (error instanceof Error) {
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
				<link rel='stylesheet' href='harmony.css' />
			</Head>
			<h2 class='center'>Release Lookup</h2>
			<ReleaseLookup gtin={gtin} externalUrl={externalUrl}/>
			{errors.map((error) => <MessageBox message={{ text: error.message, type: 'error' }} />)}
			{release && <Release release={release} />}
			{release && <ReleaseSeeder release={release} />}
		</>
	);
}
