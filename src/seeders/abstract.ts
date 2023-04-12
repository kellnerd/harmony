import { HarmonyRelease } from '../providers/common.ts';
import { FormDataRecord, MaybePromise } from '../utils/types.ts';

export default abstract class ReleaseSeeder {
	abstract readonly targetUrl: URL;

	readonly method: 'GET' | 'POST' = 'POST';

	abstract createReleaseSeed(release: HarmonyRelease): MaybePromise<FormDataRecord>;
}
