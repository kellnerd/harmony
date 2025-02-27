import type { MetadataProvider, ProviderOptions } from './base.ts';
import type { EntityId, HarmonyRelease, ReleaseOptions, ReleaseSpecifier } from '@/harmonizer/types.ts';
import { downloadMode } from '@/utils/fetch_stub.ts';
import { isDefined } from '@/utils/predicate.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { filterValues } from '@std/collections/filter-values';
import { describe, it } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

/** Specification which describes the expected behavior of a {@linkcode MetadataProvider}. */
export interface ProviderSpecification {
	/**
	 * Describes how the provider handles URLs.
	 *
	 * Tests with an `id` property describe supported URLs and the entity ID which they contain.
	 * All other tests describe unsupported URLs which are ignored by the provider.
	 */
	urls: EntityUrlTest[];
	/**
	 * Releases which the provider should be able to lookup.
	 *
	 * Each looked up and harmonized release is compared against a reference [snapshot] from a snapshot file by default.
	 * You can create new snapshots or update them by passing the `--update` flag when running the test.
	 *
	 * Custom assertions for the looked up release can be specified as well.
	 *
	 * [snapshot]: https://jsr.io/@std/testing/doc/snapshot
	 */
	releaseLookup: ReleaseLookupTest[];
}

/** Registers test suites to compare the given provider against its specification. */
export function describeProvider(provider: MetadataProvider, spec: ProviderSpecification) {
	describeEntityUrlExtraction(provider, spec.urls);
	describeEntityUrlConstruction(provider, spec.urls);
	describeReleaseLookups(provider, spec.releaseLookup);
}

/** Test case specification for a provider URL. */
export interface EntityUrlTest {
	/** Short description of the URL format. */
	description?: string;
	/** Provider URL of an entity. */
	url: URL;
	/** ID of the entity which can be extracted from the URL. */
	id?: EntityId | undefined;
	/** Indicates that the URL is canonical and can be reconstructed from the ID. */
	isCanonical?: boolean;
}

function describeEntityUrlExtraction(provider: MetadataProvider, tests: EntityUrlTest[]) {
	describe('extraction of entity type and ID from an URL', () => {
		for (const test of tests) {
			it(`${test.id ? 'supports' : 'ignores'} ${test.description ?? test.url}`, () => {
				let actualId = provider.extractEntityFromUrl(test.url);
				if (actualId) {
					// @ts-ignore-error -- `EntityId` is a valid `Record`
					actualId = filterValues(actualId, isDefined);
				}
				assertEquals(actualId, test.id);
			});
		}
	});
}

function describeEntityUrlConstruction(provider: MetadataProvider, tests: EntityUrlTest[]) {
	describe('construction of a canonical entity URL', () => {
		for (const test of tests) {
			const { id } = test;
			if (id && test.isCanonical) {
				it(`reconstructs ${test.description ?? `${id.type} URL`}`, () => {
					assertEquals(provider.constructUrl(id), test.url);
				});
			}
		}
	});
}

/** Test case specification for a release lookup. */
export interface ReleaseLookupTest {
	/** Short description of the test case. */
	description?: string;
	/** Specifies the release which should be looked up with the provider. */
	release: ReleaseSpecifier;
	/** Lookup options which should be passed to the provider. */
	options?: ReleaseOptions;
	/** Custom assertion(s) which should be performed for the looked up release. */
	assert?: (actualRelease: HarmonyRelease) => asserts actualRelease;
	/** Skip snapshot testing. Should be replaced by custom assertions. */
	skipSnapshot?: boolean;
}

function describeReleaseLookups(provider: MetadataProvider, tests: ReleaseLookupTest[]) {
	describe('release lookup', () => {
		for (const test of tests) {
			let { description, release } = test;
			if (!description) {
				if (Array.isArray(release)) {
					description = `looks up ${release[0].toUpperCase()} ${release[1]}`;
				} else if (typeof release === 'string') {
					description = `looks up ID ${release}`;
				} else if (typeof release === 'number') {
					description = `looks up GTIN ${release}`;
				} else { // release specifier should be an URL
					description = `looks up ${release}`;
				}
			}

			it(description, async (t) => {
				const actualRelease = await provider.getRelease(release, test.options);

				// Remove properties which are not stable across multiple runs.
				actualRelease.info.providers.forEach((providerInfo) => {
					delete providerInfo.cacheTime;
					delete providerInfo.processingTime;
				});

				test.assert?.(actualRelease);
				if (!test.skipSnapshot) {
					await assertSnapshot(t, actualRelease);
				}
			});
		}
	});
}

/**
 * Creates sensible provider default options for testing:
 * - Disable rate limiting, except in {@linkcode downloadMode}
 */
export function makeProviderOptions(): ProviderOptions {
	const options: ProviderOptions = {};

	if (!downloadMode) {
		options.rateLimitInterval = null;
	}

	return options;
}
