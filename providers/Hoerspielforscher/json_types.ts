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
	subRef: 'schauspieler';
	/** Relative canonical URL of the page. */
	url: string;
	dataRef: number;
}

export interface Release {
	title: string;
	artist?: string;
	coverUrl?: string;
}
