// deno-lint-ignore-file react-no-danger -- HTML is sanitized

import { render, type RenderOptions } from '@deno/gfm';

export function Markdown({ content, ...renderOptions }: { content: string } & RenderOptions) {
	const sanitizedHtml = render(content, renderOptions);

	return renderOptions.inline
		? <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
		: <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
