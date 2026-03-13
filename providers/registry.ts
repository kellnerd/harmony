import type { MetadataProvider } from './base.ts';
import { FeatureQuality, type ProviderFeature } from './features.ts';
import type { AppInfo } from '@/app.ts';
import type { ExternalEntityId } from '@/harmonizer/types.ts';
import { SnapStorage } from 'snap-storage';
import type BandcampProvider from './Bandcamp/mod.ts';
import type BeatportProvider from './Beatport/mod.ts';
import type DeezerProvider from './Deezer/mod.ts';
import type iTunesProvider from './iTunes/mod.ts';
import type MoraProvider from './Mora/mod.ts';
import type MusicBrainzProvider from './MusicBrainz/mod.ts';
import type OtotoyProvider from './Ototoy/mod.ts';
import type SpotifyProvider from './Spotify/mod.ts';
import type TidalProvider from './Tidal/mod.ts';

// deno-lint-ignore no-explicit-any
export type ConstructorOf<TConstructed> = new (...args: Array<any>) => TConstructed;
export type MetadataProviders =
	| BandcampProvider
	| BeatportProvider
	| DeezerProvider
	| iTunesProvider
	| MoraProvider
	| MusicBrainzProvider
	| OtotoyProvider
	| SpotifyProvider
	| TidalProvider;
export type MetadataProviderClasses =
	| ConstructorOf<BandcampProvider>
	| ConstructorOf<BeatportProvider>
	| ConstructorOf<DeezerProvider>
	| ConstructorOf<iTunesProvider>
	| ConstructorOf<MoraProvider>
	| ConstructorOf<MusicBrainzProvider>
	| ConstructorOf<OtotoyProvider>
	| ConstructorOf<SpotifyProvider>
	| ConstructorOf<TidalProvider>;

export interface ProviderRegistryOptions {
	/** Information about the application which is passed to each provider. */
	appInfo?: AppInfo;
	/** Path to the directory where providers should persist cached data. */
	dataDir?: string;
}

/** Registry for metadata providers. */
export class ProviderRegistry {
	constructor(options: ProviderRegistryOptions = {}) {
		this.#appInfo = options.appInfo;
		this.#snaps = new SnapStorage(options.dataDir);
	}

	/** Adds an instance of the given provider to the registry. */
	add(ProviderClass: MetadataProviderClasses) {
		const provider = new ProviderClass({ snaps: this.#snaps, appInfo: this.#appInfo });

		const { name, internalName } = provider;
		if (this.#displayNames.has(name)) {
			throw new Error(`Provider names have to be unique, "${name}" already exists`);
		}
		if (this.#internalNames.has(internalName)) {
			throw new Error(`Internal provider names have to be unique, "${internalName}" already exists`);
		}

		this.#providerList.push(provider);
		this.#providerMap[internalName] = provider;
		this.#displayNames.add(name);
		this.#internalNames.add(internalName);
		this.#displayToInternal[name] = internalName;
		this.#internalToDisplay[internalName] = name;
	}

	/** Adds an instance for each of the given providers to the registry. */
	addMultiple(...providers: Array<MetadataProviderClasses>) {
		for (const Provider of providers) {
			this.add(Provider);
		}
	}

	/** Constructs a canonical URL for the given external entity identifier. */
	constructEntityUrl(entityId: ExternalEntityId): URL {
		const provider = this.findByName(entityId.provider);
		if (!provider) {
			throw new Error(`There is no provider with the name "${entityId.provider}"`);
		}

		return provider.constructUrl(entityId);
	}

	/** Extracts the provider name, entity type and ID from a supported URL. */
	extractEntityFromUrl(entityUrl: URL): ExternalEntityId | undefined {
		const provider = this.findByUrl(entityUrl);
		if (provider) {
			const entityId = provider.extractEntityFromUrl(entityUrl);
			if (entityId) {
				return { ...entityId, provider: provider.internalName };
			}
		}
	}

	/** Returns a list of internal provider names that meet the given condition. */
	filterInternalNames(predicate: (provider: MetadataProvider) => boolean): string[] {
		return this.#providerList
			.filter((provider) => predicate(provider))
			.map((provider) => provider.internalName);
	}

	/**
	 * Returns a list of internal provider names that belong to the given category.
	 *
	 * Optionally accepts a record of cookies with the user's preferences.
	 */
	filterInternalNamesByCategory(category: string, preferences: Record<string, string> = {}): string[] {
		switch (category) {
			case 'all':
				return [...this.#internalNames];
			case 'default':
				return this.filterInternalNames((provider) =>
					// Providers which support inexpensive GTIN lookups are enabled by default.
					provider.getQuality('GTIN lookup') >= FeatureQuality.PRESENT &&
					// Exclude "internal" providers like MusicBrainz.
					provider.name !== 'MusicBrainz'
				);
			case 'preferred':
				// Get all providers for which the preference is enabled.
				// The value of an enabled preference is defined by `ProviderCheckbox`.
				return this.filterInternalNames((provider) => preferences[provider.internalName] === '1');
			default:
				// TODO: Add a real `categories` property to `MetadataProvider` and use it here.
				return [];
		}
	}

	/** Finds a registered provider by name (internal name or display name). */
	findByName(name: string): MetadataProviders | undefined {
		const internalName = this.toInternalName(name);
		return internalName ? this.#providerMap[internalName] : undefined;
	}

	/** Finds a registered provider which supports the domain of the given URL. */
	findByUrl(url: URL | string): MetadataProviders | undefined {
		return this.#providerList.find((provider) => provider.supportsDomain(url));
	}

	/** Display names of all providers. */
	get displayNames(): string[] {
		return Array.from(this.#displayNames);
	}

	/** Internal names of all providers. */
	get internalNames(): Set<string> {
		return this.#internalNames;
	}

	/** Returns a list of provider names sorted by the quality value of the given feature (descending). */
	sortNamesByQuality(feature: ProviderFeature): string[] {
		return this.#providerList
			.map((provider) => ({
				name: provider.name,
				quality: provider.getQuality(feature),
			}))
			.sort((a, b) => b.quality - a.quality)
			.map((provider) => provider.name);
	}

	toDisplayName(name: string): string | undefined {
		if (this.#displayNames.has(name)) return name;
		return this.#internalToDisplay[name];
	}

	toInternalName(name: string): string | undefined {
		if (this.#internalNames.has(name)) return name;
		return this.#displayToInternal[name];
	}

	#appInfo: AppInfo | undefined;
	#providerList: MetadataProviders[] = [];
	#providerMap: Record<string, MetadataProviders> = {};
	#displayNames = new Set<string>();
	#internalNames = new Set<string>();
	#displayToInternal: Record<string, string | undefined> = {};
	#internalToDisplay: Record<string, string | undefined> = {};
	#snaps: SnapStorage;
}
