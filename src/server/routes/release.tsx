import { Release } from '../components/Release.tsx';
import { ReleaseSeeder } from '../components/ReleaseSeeder.tsx';
import { getMergedReleaseByGTIN, getReleaseByUrl } from '../../lookup.ts';
import { Head } from 'fresh/runtime.ts';
import { Handlers, PageProps } from 'fresh/server.ts';

import type { GTIN, HarmonyRelease, ReleaseOptions } from '../../harmonizer/types.ts';

type Data = {
	errors: Error[];
	release?: HarmonyRelease;
	gtin: GTIN | null;
	link: string | null;
};

export const handler: Handlers<Data> = {
	async GET(req, ctx) {
		const url = new URL(req.url);
		const gtin = url.searchParams.get('gtin');
		const link = url.searchParams.get('link');

		const errors: Error[] = [];
		const options: ReleaseOptions = {
			withSeparateMedia: true,
			withAllTrackArtists: true,
		};

		let release: HarmonyRelease | undefined;
		try {
			if (gtin) {
				release = await getMergedReleaseByGTIN(gtin, options);
			} else if (link) {
				release = await getReleaseByUrl(new URL(link), options);
			}
		} catch (error) {
			if (error instanceof Error) {
				errors.push(error);
			}
		}

		return ctx.render({ errors, release, gtin, link });
	},
};

export default function Page({ data }: PageProps<Data>) {
	const { errors, release, gtin, link } = data;
	return (
		<>
			<Head>
				<title>{release?.title ?? 'Release Lookup'} &ndash; Harmony</title>
			</Head>
			<h2>Release Lookup</h2>
			<form>
				<div>
					<label for='gtin-input'>
						<abbr title='Global Trade Item Number'>GTIN</abbr>:
					</label>
					<input type='text' name='gtin' id='gtin-input' value={gtin ?? ''} />
				</div>
				<div>
					<label for='link-input'>URL:</label>
					<input type='text' name='link' id='link-input' value={link ?? ''} />
				</div>
				<button type='submit'>Lookup</button>
			</form>
			{errors.map((error) => <p class='error'>{error.message}</p>)}
			{release && <Release {...release} />}
			{release && <ReleaseSeeder release={release} />}
		</>
	);
}
