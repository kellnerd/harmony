// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_app from './routes/_app.tsx';
import * as $_middleware from './routes/_middleware.ts';
import * as $about from './routes/about.tsx';
import * as $icon_sprite_svg from './routes/icon-sprite.svg.tsx';
import * as $index from './routes/index.tsx';
import * as $release from './routes/release.tsx';
import * as $release_actions from './routes/release/actions.tsx';
import * as $PersistentInput from './islands/PersistentInput.tsx';
import * as $RegionList from './islands/RegionList.tsx';
import { type Manifest } from '$fresh/server.ts';

const manifest = {
	routes: {
		'./routes/_app.tsx': $_app,
		'./routes/_middleware.ts': $_middleware,
		'./routes/about.tsx': $about,
		'./routes/icon-sprite.svg.tsx': $icon_sprite_svg,
		'./routes/index.tsx': $index,
		'./routes/release.tsx': $release,
		'./routes/release/actions.tsx': $release_actions,
	},
	islands: {
		'./islands/PersistentInput.tsx': $PersistentInput,
		'./islands/RegionList.tsx': $RegionList,
	},
	baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
