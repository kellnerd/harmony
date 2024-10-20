import { codeUrl, shortRevision } from '@/server/config.ts';

/** Information about the application. */
export interface AppInfo {
	/** Name of the application. */
	name: string;
	/** Version of the application. */
	version: string;
	/** Contact URL for the application. */
	contact?: string;
}

/** App information about Harmony. */
export const appInfo: AppInfo = {
	name: 'Harmony',
	version: shortRevision,
	contact: codeUrl.href,
};
