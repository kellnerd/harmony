import type { AdvisoryRating } from '@/harmonizer/types.ts';

export function AdvisoryRatingIcon({ advisoryRating }: { advisoryRating: AdvisoryRating }) {
	const marker = advisoryRating === 'explicit' ? 'E' : 'C';

	return (
		<span class='advisory-rating'>
			<abbr title={advisoryRating}>{marker}</abbr>
		</span>
	);
}
