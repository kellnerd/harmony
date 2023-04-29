import DeezerProvider from './providers/Deezer.ts';

import type { MetadataProvider } from './providers/abstract.ts';

const cacheName = 'providers-v1';
const cache = await caches.open(cacheName);

export const providers: MetadataProvider<unknown>[] = [
	DeezerProvider,
].map((Provider) => new Provider({ cache }));

export const providerNames = providers.map((provider) => provider.name);
