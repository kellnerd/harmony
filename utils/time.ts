export function formatDuration(ms: number, {
	showMs = false,
} = {}): string {
	const timeComponents: number[] = [];

	const seconds = Math.floor(ms / 1000);
	timeComponents.unshift(seconds % 60);

	const minutes = Math.floor(seconds / 60);
	timeComponents.unshift(minutes % 60);

	const hours = Math.floor(minutes / 60);
	if (hours) {
		timeComponents.unshift(hours);
	}

	let duration = timeComponents.map((component, index) => {
		if (index) {
			// zero-pad all used time components except for the leading one
			return component.toString().padStart(2, '0');
		} else {
			return component;
		}
	}).join(':');

	ms %= 1000;
	if (ms || showMs) {
		duration += '.' + ms.toString().padStart(3, '0');
	}

	return duration;
}

export function formatTimestampAsISOString(unixSeconds: number): string {
	return new Date(unixSeconds * 1000).toISOString().replace('.000', '');
}
