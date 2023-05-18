export function TextWithLineBreaks({ lines }: { lines: string[] }) {
	return (
		<>
			{lines.map((line, index) => (
				<>
					{line}
					{(index !== lines.length - 1) && <br />}
				</>
			))}
		</>
	);
}
