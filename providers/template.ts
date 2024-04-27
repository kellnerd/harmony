/**
 * Template for a new provider implementation.
 *
 * Each required property is documented in the abstract base class.
 *
 * Complex provider entity type definitions should be defined in a separate module.
 */

import type { HarmonyRelease } from '@/harmonizer/types.ts';
import { DurationPrecision, type EntityId, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';

export default class TemplateProvider extends MetadataProvider {
	readonly name = '';

	readonly supportedUrls = new URLPattern({
		hostname: 'www.example.com',
		pathname: '/:type(artist|release)/:id',
	});

	readonly entityTypeMap = {
		artist: '',
		release: '',
	};

	readonly releaseLookup = TemplateReleaseLookup;

	readonly durationPrecision = DurationPrecision.SECONDS;

	readonly artworkQuality = 0;

	constructUrl(entity: EntityId): URL {
		throw new Error('Method not implemented.');
	}
}

export class TemplateReleaseLookup extends ReleaseLookup<TemplateProvider, Release> {
	constructReleaseApiUrl(): URL | undefined {
		throw new Error('Method not implemented.');
	}

	getRawRelease(): Promise<Release> {
		throw new Error('Method not implemented.');
	}

	convertRawRelease(rawRelease: Release): Promise<HarmonyRelease> {
		throw new Error('Method not implemented.');
	}
}

// Type of raw release data from the provider (for example an API result).
export type Release = {};
