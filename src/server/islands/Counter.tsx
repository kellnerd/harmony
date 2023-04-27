import { Button } from '../components/Button.tsx';
import { useState } from 'preact/hooks';

type CounterProps = {
	start: number;
};

export default function Counter(props: CounterProps) {
	const [count, setCount] = useState(props.start);

	return (
		<div>
			<Button onClick={() => setCount(count - 1)}>-1</Button>
			<span>{count}</span>
			<Button onClick={() => setCount(count + 1)}>+1</Button>
		</div>
	);
}
