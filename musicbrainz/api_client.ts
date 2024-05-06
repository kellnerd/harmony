import { MusicBrainzClient } from '@kellnerd/musicbrainz';
import { codeUrl, shortRevision } from '@/server/config.ts';

export const MB = new MusicBrainzClient({
	app: {
		name: 'Harmony',
		version: shortRevision,
		contact: codeUrl.href,
	},
	maxQueueSize: 30,
});
