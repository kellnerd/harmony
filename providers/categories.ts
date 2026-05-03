/** Provider category names and their descriptions. */
export const categoryDescriptions = {
	'default': 'Default providers which have digital music from many genres.',
	'preferred': 'Preferred providers from the user’s settings (your settings).',
	'digital': 'Download and streaming platforms.',
	'database': 'Music databases.',
	'all': 'All providers. Not recommended to use as releases are usually not available from all providers.',
} satisfies Record<string, string>;

/** Category names which can be assigned to a provider. */
export type ProviderCategory = Exclude<keyof typeof categoryDescriptions, 'all' | 'default' | 'preferred'>;
