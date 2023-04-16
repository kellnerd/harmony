import { HarmonyRelease } from '../providers/common.ts';
import type { FormDataRecord, MaybePromise } from 'utils/types.d.ts';

export default abstract class ReleaseSeeder {
	abstract readonly targetUrl: URL;

	readonly method: 'GET' | 'POST' = 'POST';

	abstract createReleaseSeed(release: HarmonyRelease): MaybePromise<FormDataRecord>;
}
