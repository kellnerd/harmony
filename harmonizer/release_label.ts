import { ArtistCreditName, Label } from '@/harmonizer/types.ts';
import { noLabel } from '@/musicbrainz/special_entities.ts';

/** Placeholder label names that are used by DistroKid. */
export const DISTRO_KID_PATTERN = /^(Distro ?Kid|\d+ Records DK\d*)$/;

function replaceByNoLabel(label: Label) {
	label.name = noLabel.name;
	label.mbid = noLabel.mbid;
	delete label.externalIds;
}

/** Tries to clean up common cases of release labels which are not considered imprints by MusicBrainz. */
export function cleanupBogusReleaseLabels(labels: Label[], artists?: ArtistCreditName[]) {
	const artistNames = artists?.map(({ name, creditedName }) => creditedName ?? name);

	for (const label of labels) {
		// Labels are not considered an imprint if the release was self-published.
		// Stores sometimes require a label for self-releases and therefore use the artist name
		// (https://musicbrainz.org/doc/Style/Unknown_and_untitled/Special_purpose_label#About_auto-releases_or_self-releases)
		if (label.name && artistNames?.includes(label.name)) {
			replaceByNoLabel(label);
		} else if (label.name && DISTRO_KID_PATTERN.test(label.name)) {
			// DistroKid (https://musicbrainz.org/label/4108147d-f37e-4151-a3e9-d92f0074f1eb) is a distributor
			replaceByNoLabel(label);
		}
	}
}
