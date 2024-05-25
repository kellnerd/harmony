import type { MetadataProvider, MetadataProviderConstructor } from './base.ts';
import { FeatureQuality, ProviderFeature } from './features.ts';
import type { ExternalEntityId } from '@/harmonizer/types.ts';
import { SnapStorage } from 'snap-storage';

/** Registry for metadata providers. */
export class ProviderRegistry {
	/** Adds an instance of the given provider to the registry. */
	add(Provider: MetadataProviderConstructor) {
		const provider = new Provider({ snaps: this.#snaps });

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
	addMultiple(...providers: MetadataProviderConstructor[]) {
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

	/** Returns a list of internal provider names that belong to the given category. */
	filterInternalNamesByCategory(category: string): string[] {
		if (category === 'all') {
			return [...this.#internalNames];
		} else {
			// TODO: Add a real `categories` property to `MetadataProvider` and use it here.
			return [];
		}
	}

	/** Returns a list of internal provider names that meet the quality condition for the given feature. */
	filterInternalNamesByQuality(feature: ProviderFeature, predicate: (quality: number) => boolean): string[] {
		return this.#providerList
			.filter((provider) => predicate(provider.features[feature] ?? FeatureQuality.UNKNOWN))
			.map((provider) => provider.internalName);
	}

	/** Finds a registered provider by name (internal name or display name). */
	findByName(name: string): MetadataProvider | undefined {
		const internalName = this.toInternalName(name);
		return internalName ? this.#providerMap[internalName] : undefined;
	}

	/** Finds a registered provider which supports the domain of the given URL. */
	findByUrl(url: URL): MetadataProvider | undefined {
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
				quality: provider.features[feature] ?? FeatureQuality.UNKNOWN,
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

	#providerList: MetadataProvider[] = [];
	#providerMap: Record<string, MetadataProvider> = {};
	#displayNames = new Set<string>();
	#internalNames = new Set<string>();
	#displayToInternal: Record<string, string | undefined> = {};
	#internalToDisplay: Record<string, string | undefined> = {};
	#snaps = new SnapStorage();
}
