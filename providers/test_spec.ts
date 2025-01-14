import type { MetadataProvider } from './base.ts';
import type { EntityId } from '@/harmonizer/types.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from 'std/testing/bdd.ts';

/** Specification which describes the expected behavior of a {@linkcode MetadataProvider}. */
export interface ProviderSpecification {
	/**
	 * Describes how the provider handles URLs.
	 *
	 * Tests with an `id` property describe supported URLs and the entity ID which they contain.
	 * All other tests describe unsupported URLs which are ignored by the provider.
	 */
	urls: EntityUrlTest[];
}

/** Registers test suites to compare the given provider against its specification. */
export function describeProvider(provider: MetadataProvider, spec: ProviderSpecification) {
	describeEntityUrlExtraction(provider, spec.urls);
	describeEntityUrlConstruction(provider, spec.urls);
}

/** Test case specification for a provider URL. */
export interface EntityUrlTest {
	/** Provider URL of an entity. */
	url: URL;
	/** ID of the entity which can be extracted from the URL. */
	id?: EntityId | undefined;
	/** Short description of the URL format. */
	description?: string;
	/** Indicates that the URL is canonical and can be reconstructed from the ID. */
	isCanonical?: boolean;
}

function describeEntityUrlExtraction(provider: MetadataProvider, tests: EntityUrlTest[]) {
	describe('extraction of entity type and ID from an URL', () => {
		for (const test of tests) {
			it(`${test.id ? 'supports' : 'ignores'} ${test.description ?? test.url}`, () => {
				assertEquals(provider.extractEntityFromUrl(test.url), test.id);
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
