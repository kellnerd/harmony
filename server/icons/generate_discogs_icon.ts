function createDiscogsIcon() {
	const reflectionAngle = 45;
	const gapAngle = 30;
	const grooveRadii = [10, 7, 4];
	const paths = grooveRadii.flatMap((radius) => createGroove(radius, reflectionAngle, gapAngle));

	return [
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-discogs">',
		'  <path stroke="none" d="M0 0h24v24H0z" fill="none" />',
		...paths,
		'  <path d="M12 12v0.01" />',
		'</svg>',
	].join('\n');
}

function createGroove(radius: number, reflectionAngle: number, gapAngle: number) {
	return [
		createArcAroundCenter(radius, reflectionAngle + gapAngle / 2, reflectionAngle + 180 - gapAngle / 2),
		createArcAroundCenter(radius, reflectionAngle + 180 + gapAngle / 2, reflectionAngle + 360 - gapAngle / 2),
	];
}

function createArcAroundCenter(radius: number, startAngle: number, endAngle: number) {
	return `  <path d="${describeArc(12, 12, radius, startAngle, endAngle)}" />`;
}

// https://stackoverflow.com/a/18473154
function describeArc(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
	const start = polarToCartesian(centerX, centerY, radius, endAngle);
	const end = polarToCartesian(centerX, centerY, radius, startAngle);

	const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

	const d = [
		'M',
		formatCoordinate(start.x),
		formatCoordinate(start.y),
		'A',
		radius,
		radius,
		0,
		largeArcFlag,
		0,
		formatCoordinate(end.x),
		formatCoordinate(end.y),
	].join(' ');

	return d;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
	const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians)),
	};
}

function formatCoordinate(value: number): string {
	return value.toLocaleString('en', { maximumFractionDigits: 2 });
}

if (import.meta.main) {
	await Deno.writeTextFile('discogs.svg', createDiscogsIcon());
}
