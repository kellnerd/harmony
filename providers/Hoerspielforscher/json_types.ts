import { AnchorTag } from '@/utils/html.ts';

export interface EpisodeData {
	/** ID of the audio drama episode. */
	id: number;
	/** Title of the page, including catalog number and "Die Hörspielforscher". */
	title: string;
	/** Main page content as HTML string. */
	main: string;
	/** Requested subsection/tab as HTML string. */
	subsection: string;
	/** Reference name of the subsection. */
	subRef: 'musik' | 'schauspieler';
	/** Relative canonical URL of the page. */
	url: string;
	dataRef: number;
}

export interface Release {
	/** ID of the release (shared by "hoerspiel" and "album"). */
	id: number;
	/** Title of the release, including series title and episode number. */
	title: string;
	/** Format: `<title> - <label> [#media]<format> <catno> (<year>)` */
	description: string;
	/** Name of the credited main artist. */
	artist?: string;
	/** URL for the credited artist. */
	artistUrl?: string;
	/** Release label name and URL. */
	label?: AnchorTag;
	/** URL of the cover art (thumbnail). */
	coverUrl?: string;
	/** Duration of the release and its mediums/sides (in parentheses). */
	duration?: string;
	/** Names of the chapters/episodes on the release. */
	chapters: string[];
	/** Additional info. */
	info: Record<string, string>;
}
