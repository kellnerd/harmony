import { appInfo } from '@/app.ts';
import { musicbrainzSourceServer } from '@/config.ts';
import { MusicBrainzClient } from '@kellnerd/musicbrainz';
import { join } from 'std/url/join.ts';

export const MB = new MusicBrainzClient({
	apiUrl: join(musicbrainzSourceServer, 'ws/2/').href,
	app: appInfo,
	maxQueueSize: 20,
});
