import { MusicBrainzClient } from '@kellnerd/musicbrainz';
import { appInfo } from '@/app.ts';

export const MB = new MusicBrainzClient({
	app: appInfo,
	maxQueueSize: 20,
});
