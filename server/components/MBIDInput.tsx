import type { JSX } from 'preact';
import InputWithOverlay from './InputWithOverlay.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

export function MBIDInput(props: JSX.HTMLAttributes<HTMLInputElement>) {
	return (
		<InputWithOverlay placeholder='MusicBrainz URL or MBID' {...props}>
			<SpriteIcon name='brand-metabrainz' />
		</InputWithOverlay>
	);
}
