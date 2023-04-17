import DeezerProvider from './providers/Deezer.ts';
import { LookupError } from './utils/errors.ts';

import type MetadataProvider from './providers/abstract.ts';
import type { HarmonyRelease, ReleaseOptions } from './providers/common.ts';

const providers: MetadataProvider<unknown>[] = [
	DeezerProvider,
].map((Provider) => new Provider());

export function getReleaseByUrl(url: URL, options?: ReleaseOptions): Promise<HarmonyRelease> {
	const matchingProvider = providers.find((provider) => provider.supportsDomain(url));

	if (!matchingProvider) {
		throw new LookupError(`No provider supports ${url}`);
	}

	return matchingProvider.getRelease(url, options);
}
