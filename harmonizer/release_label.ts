import { Label } from '@/harmonizer/types.ts';
import { noLabel } from '@/musicbrainz/special_entities.ts';

/** Placeholder label names that are used by DistroKid. */
export const DISTRO_KID_PATTERN = /^(Distro ?Kid|\d+ Records DK\d*)$/;

/** Tries to clean up common cases of release labels which are not considered imprints by MusicBrainz. */
export function cleanupBogusReleaseLabels(labels: Label[]) {
	for (const label of labels) {
		if (label.name && DISTRO_KID_PATTERN.test(label.name)) {
			// DistroKid (https://musicbrainz.org/label/4108147d-f37e-4151-a3e9-d92f0074f1eb) is a distributor
			label.name = noLabel.name;
			label.mbid = noLabel.mbid;
			delete label.externalIds;
		}
	}
}
