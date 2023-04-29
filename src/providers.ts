import DeezerProvider from './providers/Deezer.ts';

import type { MetadataProvider } from './providers/abstract.ts';

export const providers: MetadataProvider<unknown>[] = [
	DeezerProvider,
].map((Provider) => new Provider());

export const providerNames = providers.map((provider) => provider.name);
