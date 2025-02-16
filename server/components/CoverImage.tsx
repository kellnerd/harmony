import { ProviderIcon } from '@/server/components/ProviderIcon.tsx';

import type { Artwork } from '@/harmonizer/types.ts';

export function CoverImage({ artwork }: { artwork: Artwork }) {
	const { provider } = artwork;
	let description = artwork.types?.join(' + ') ?? 'cover';
	if (artwork.comment) {
		description += ` (${artwork.comment})`;
	}

	return (
		<figure class='cover-image'>
			<a href={artwork.url}>
				<img src={artwork.thumbUrl ?? artwork.url} alt={description} title={description} />
			</a>
			<figcaption>
				{artwork.comment}
				{artwork.types?.map((type) => <span class='label'>Type: {type}</span>)}
				<span class='label'>
					Source: {provider
						? (
							<>
								<ProviderIcon providerName={provider} stroke={1.25} />
								{provider}
							</>
						)
						: new URL(artwork.url).hostname}
				</span>
			</figcaption>
		</figure>
	);
}
