import Counter from '../islands/Counter.tsx';
import { Head } from 'fresh/runtime.ts';

export default function Home() {
	return (
		<>
			<Head>
				<title>Harmony</title>
			</Head>
			<div>
				<p>Welcome to Harmony!</p>
				<Counter start={3} />
			</div>
		</>
	);
}
