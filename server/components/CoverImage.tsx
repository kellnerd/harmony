import type { Artwork } from '@/harmonizer/types.ts';

export function CoverImage({ artwork }: { artwork: Artwork }) {
	let description = artwork.types?.join(' + ') ?? 'cover';
	if (artwork.comment) {
		description += ` (${artwork.comment})`;
	}

	return (
		<figure class='cover-image'>
			<a href={artwork.url.href} target='_blank'>
				<img src={artwork.thumbUrl?.href ?? artwork.url.href} alt={description} title={description} />
			</a>
			<figcaption>
				{artwork.comment}
				{artwork.types?.map((type) => <span class='label'>Type: {type}</span>)}
				<span class='label'>Source: {artwork.url.hostname}</span>
			</figcaption>
		</figure>
	);
}
