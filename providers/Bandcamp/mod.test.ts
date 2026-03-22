import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { assert } from 'std/assert/assert.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

import BandcampProvider from './mod.ts';
import { isDefined } from '@/utils/predicate.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';

describe('Bandcamp provider', () => {
	const bc = new BandcampProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(bc);

	describeProvider(bc, {
		urls: [{
			description: 'album page',
			url: new URL('https://theuglykings.bandcamp.com/album/darkness-is-my-home'),
			id: { type: 'album', id: 'theuglykings/darkness-is-my-home' },
			isCanonical: true,
		}, {
			description: 'album page with tracking parameter',
			url: new URL('https://hiroshi-yoshimura.bandcamp.com/album/flora?from=discover_page'),
			id: { type: 'album', id: 'hiroshi-yoshimura/flora' },
		}, {
			description: 'standalone track page',
			url: new URL('https://zeug.bandcamp.com/track/yeltsa-kcir'),
			id: { type: 'track', id: 'zeug/yeltsa-kcir' },
			serializedId: 'zeug/track/yeltsa-kcir',
			isCanonical: true,
		}, {
			description: 'artist page/subdomain',
			url: new URL('https://taxikebab.bandcamp.com/'),
			id: { type: 'artist', id: 'taxikebab' },
			isCanonical: true,
		}, {
			description: 'artist /music page',
			url: new URL('https://theuglykings.bandcamp.com/music'),
			id: { type: 'artist', id: 'theuglykings' },
			isCanonical: false,
		}, {
			description: 'URL without subdomain',
			url: new URL('https://bandcamp.com/discover'),
			id: undefined,
		}],
		invalidIds: ['https://example.bandcamp.com/url'],
		releaseLookup: [{
			description: 'label release with fixed price (which is not free despite minimum_price of 0.0)',
			release: 'thedarkthursday/and-it-was-a-burned-into-my-mind-yet-i-faltered-like-a-broken-record',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				const isFree = release.externalLinks.some((link) => link.types?.includes('free download'));
				assert(!isFree, 'Release should not be downloadable for free');
				const accountName = 'thedarkthursday';
				assert(
					release.labels?.some((label) => label.externalIds?.some(({ id }) => id === accountName)),
					'Bandcamp account should be linked to a label',
				);
				assert(
					!release.artists?.some((artist) => artist.externalIds?.some(({ id }) => id === accountName)),
					'Bandcamp account should not be linked to an artist',
				);
			},
		}, {
			description: 'subscriber-only release',
			release: 'arbee/des-papiers-ii',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const recordingBandcampLinks = release.media.flatMap((medium) =>
					medium.tracklist.map((track) => track.recording?.externalIds?.find((link) => link.provider === 'bandcamp'))
				).filter(isDefined);

				assertEquals(
					recordingBandcampLinks.filter((link) => link.linkTypes?.includes('free streaming')).length,
					0,
					'0 tracks should be free streaming',
				);

				assertEquals(
					recordingBandcampLinks.filter((link) => link.linkTypes?.includes('paid download')).length,
					1,
					'1 tracks should be paid download',
				);

				assertEquals(
					recordingBandcampLinks.filter((link) => link.linkTypes?.includes('free download')).length,
					0,
					'0 tracks should be free download',
				);

				const releaseBandcampLink = release.externalLinks.find((link) => link.url.includes('bandcamp.com'));

				const isFreeStreaming = releaseBandcampLink?.types?.includes('free streaming');
				assert(!isFreeStreaming, 'Release should not be free streaming');

				const isPaidDownload = releaseBandcampLink?.types?.includes('paid download');
				assert(isPaidDownload, 'Release should be paid download');

				const isFreeDownload = releaseBandcampLink?.types?.includes('free download');
				assert(!isFreeDownload, 'Release should not be free download');
			},
		}, {
			description: 'subscriber-only release with Creative Commons license',
			release: 'stevelawson/ambiguous-hands',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const hasLicense = release.externalLinks.some((link) => link.types?.includes('license'));
				assert(hasLicense, 'Release should have a linked license');

				const license = release.externalLinks.find((link) => link.types?.includes('license'));
				assert(
					license?.url === 'http://creativecommons.org/licenses/by-nc-sa/3.0/',
					'Release should link to Creative Commons license page',
				);
			},
		}, {
			description: 'single track release',
			release: 'svenfredrik/track/mr-florida-81',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const hasSingleReleaseGroupType = release.types?.includes('Single');
				assert(hasSingleReleaseGroupType, 'Release should be type Single');

				const tracksWithIsrc = release.media.flatMap((medium) =>
					medium.tracklist.filter((track) => typeof track.isrc === 'string' && track.isrc.length > 0)
				);
				assertEquals(tracksWithIsrc.length, 1, 'Release tracks should have ISRCs');
			},
		}, {
			description: 'release with name your price (non-minimum price), but tracks have minimum price',
			release: 'frisyr/demo',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const releaseBandcampLink = release.externalLinks.find((link) => link.url.includes('bandcamp.com'));

				const isPaidDownload = releaseBandcampLink?.types?.includes('paid download');
				assert(isPaidDownload, 'Release should be paid download');

				const isFreeDownload = releaseBandcampLink?.types?.includes('free download');
				assert(isFreeDownload, 'Release should be free download');

				const recordingBandcampLinks = release.media.flatMap((medium) =>
					medium.tracklist.map((track) => track.recording?.externalIds?.find((link) => link.provider === 'bandcamp'))
				).filter(isDefined);

				assertEquals(
					recordingBandcampLinks.filter((link) => link.linkTypes?.includes('paid download')).length,
					3,
					'3 tracks should be paid download (the other 3 can only be downloaded by acquiring the whole album)',
				);

				assertEquals(
					recordingBandcampLinks.filter((link) => link.linkTypes?.includes('free download')).length,
					0,
					'0 tracks should be free download',
				);
			},
		}, {
			description: 'release with name your price (non-minimum price), but most tracks have non-minimum price',
			release: 'muzea/ambient-energy-name-your-price',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const recordingBandcampLinks = release.media.flatMap((medium) =>
					medium.tracklist.map((track) => track.recording?.externalIds?.find((link) => link.provider === 'bandcamp'))
				).filter(isDefined);

				assertEquals(
					recordingBandcampLinks.filter((link) => link.linkTypes?.includes('paid download')).length,
					5,
					'5 tracks should be paid download',
				);

				// TODO: This case should pass. It would require minimum prices of the individual tracks, which require data from the track page.
				// assertEquals(
				// 	recordingBandcampLinks.filter((link) => link.linkTypes?.includes('free download')).length,
				// 	4,
				// 	'4 tracks should be free download (one track has a minimum price)',
				// );
			},
		}, {
			description: 'release with some download only tracks and one streamable track',
			release: 'hipdozer/futon-feels',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
			},
		}, {
			description: 'release with a hidden track',
			release: 'spinningrust/do-you-like-acid-ep',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const hasHiddenTrackWarning = release.info.messages.some((message) =>
					message.provider === 'Bandcamp' &&
					message.type === 'warning' &&
					message.text === '1\xa0track is hidden and only available with the download'
				);
				assert(hasHiddenTrackWarning, 'Should display warning about the hidden track');

				const trackCount = release.media.flatMap((medium) => medium.tracklist).length;
				assertEquals(trackCount, 6, 'Release should have 6 tracks (5 listed and 1 hidden)');
			},
		}, {
			description:
				'release with 7/12 tracks streamable, i.e. more than half track as streamable while rest is download only',
			release: 'lunar-module/bear-creek',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const hasPhysicalReleaseInfo = release.info.messages.some((message) =>
					message.provider === 'Bandcamp' &&
					message.type === 'info' &&
					message.text ===
						'Available physical release packages:\n- **Bear Creek CD**: Compact Disc (CD) (edition of null, GTIN: 5060889590868)'
				);
				assert(hasPhysicalReleaseInfo, 'Should display info about physical release');

				const isFreeStreaming = release.externalLinks.some((link) => link.types?.includes('free streaming'));
				assert(!isFreeStreaming, 'Release should not be free streaming');

				const freeStreamingTrackCount = release.media.flatMap((medium) =>
					medium.tracklist.map((track) =>
						track.recording?.externalIds?.find((link) => link.provider === 'bandcamp')
					)
				).filter((link) => link?.linkTypes?.includes('free streaming')).length;

				assertEquals(freeStreamingTrackCount, 7, '7 tracks should be free streaming');
			},
		}],
	});

	afterAll(() => {
		lookupStub.restore();
	});
});
