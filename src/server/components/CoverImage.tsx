import type { Artwork } from '../../harmonizer/types.ts';

export function CoverImage({ artwork }: { artwork: Artwork }) {
	let description = artwork.types?.join(' + ') ?? 'cover';
	if (artwork.comment) {
		description += ` (${artwork.comment})`;
	}

	return (
		<div class='cover-image'>
			<a href={artwork.url.href} target='_blank'>
				<img src={artwork.thumbUrl?.href ?? artwork.url.href} alt={description} title={description} />
			</a>
		</div>
	);
}
