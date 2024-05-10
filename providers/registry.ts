import type { MetadataProvider, MetadataProviderConstructor } from './base.ts';
import type { ExternalEntityId } from '@/harmonizer/types.ts';
import { SnapStorage } from 'snap-storage';

/** Registry for metadata providers. */
export class ProviderRegistry {
	/** Adds an instance of the given provider to the registry. */
	add(Provider: MetadataProviderConstructor) {
		const provider = new Provider({ snaps: this.#snaps });

		const { name, simpleName } = provider;
		if (this.#displayNames.has(name)) {
			throw new Error(`Provider names have to be unique, "${name}" already exists`);
		}
		if (this.#internalNames.has(simpleName)) {
			throw new Error(`Internal provider names have to be unique, "${simpleName}" already exists`);
		}

		this.#providerList.push(provider);
		this.#providerMap[simpleName] = provider;
		this.#displayNames.add(name);
		this.#internalNames.add(simpleName);
		this.#displayToInternal[name] = simpleName;
		this.#internalToDisplay[simpleName] = name;
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

	/** Returns a list of provider names sorted by the value of the given numeric property (descending). */
	sortNamesByQuality(property: NumericKeys<MetadataProvider>): string[] {
		return this.#providerList
			.map((provider) => ({
				name: provider.name,
				quality: provider[property],
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

type NumericKeys<T> = {
	[K in keyof T]-?: T[K] extends number ? K : never;
}[keyof T];
