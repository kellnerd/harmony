import { appInfo } from '@/app.ts';
import { musicbrainzApiBaseUrl } from '@/config.ts';
import { MusicBrainzClient } from '@kellnerd/musicbrainz';

export const MB = new MusicBrainzClient({
	apiUrl: musicbrainzApiBaseUrl,
	app: appInfo,
	maxQueueSize: 20,
});
