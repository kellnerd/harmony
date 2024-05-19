import { blue, bold, red, yellow } from 'std/fmt/colors.ts';
import { setup } from 'std/log/setup.ts';
import { ConsoleHandler } from 'std/log/console_handler.ts';
import type { LevelName } from 'std/log/levels.ts';

setup({
	handlers: {
		default: new ConsoleHandler('DEBUG', {
			formatter: ({ levelName, loggerName, msg }) => `${loggerName} [${color(levelName)}] ${msg}`,
			// Disable coloring of the whole formatted message.
			useColors: false,
		}),
	},
	loggers: {
		'harmony.lookup': {
			handlers: ['default'],
			level: 'INFO',
		},
		'harmony.mbid': {
			handlers: ['default'],
			level: 'DEBUG', // temporary
		},
		'harmony.server': {
			handlers: ['default'],
			level: 'INFO',
		},
	},
});

function color(level: string): string {
	switch (level as LevelName) {
		case 'INFO':
			return blue(level);
		case 'WARN':
			return yellow(level);
		case 'ERROR':
			return red(level);
		case 'CRITICAL':
			return bold(red(level));
		default:
			return level;
	}
}
