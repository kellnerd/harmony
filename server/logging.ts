import { inDevMode } from '@/config.ts';
import { blue, bold, green, magenta, red, yellow } from 'std/fmt/colors.ts';
import { ConsoleHandler } from 'std/log/console_handler.ts';
import type { LevelName } from 'std/log/levels.ts';
import { setup } from 'std/log/setup.ts';

setup({
	handlers: {
		default: new ConsoleHandler('DEBUG', {
			formatter: ({ levelName, loggerName, msg }) => `${loggerName} [${color(levelName)}] ${msg}`,
			// Disable coloring of the whole formatted message.
			useColors: false,
		}),
		request: new ConsoleHandler('DEBUG', {
			formatter: ({ msg, args: [req] }) => `${magenta((req as Request).method)} ${msg}`,
			// Disable coloring of the whole formatted message.
			useColors: false,
		}),
	},
	loggers: {
		'harmony.lookup': {
			handlers: ['default'],
			level: 'DEBUG', // temporary
		},
		'harmony.mbid': {
			handlers: ['default'],
			level: 'DEBUG', // temporary
		},
		'harmony.provider': {
			handlers: ['default'],
			level: inDevMode ? 'DEBUG' : 'INFO',
		},
		'harmony.server': {
			handlers: ['default'],
			level: 'INFO',
		},
		'requests': {
			handlers: ['request'],
			level: inDevMode ? 'INFO' : 'WARN',
		},
	},
});

function color(level: string): string {
	switch (level as LevelName) {
		case 'DEBUG':
			return green(level);
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
