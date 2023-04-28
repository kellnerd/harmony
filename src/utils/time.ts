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

	let duration = timeComponents.map((component) => component.toString().padStart(2, '0')).join(':');

	ms %= 1000;
	if (ms || showMs) {
		duration += '.' + ms.toString().padStart(3, '0');
	}

	return duration;
}
