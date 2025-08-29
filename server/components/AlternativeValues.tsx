import { ProviderIcon } from '@/server/components/ProviderIcon.tsx';

import type { ProviderName } from '@/harmonizer/types.ts';
import { uniqueMappedValues } from '@/utils/record.ts';

export interface AlternativeValueProps<Root, Value> {
	property: (root: Root) => Value | undefined;
	display?: (value: Value) => unknown;
	identifier?: (value: Value) => string;
}

export function setupAlternativeValues<Root>(providerMap: Record<ProviderName, Root> | undefined) {
	if (!providerMap) {
		return () => null;
	}

	return function AlternativeValues<Value,>({ property, display, identifier }: AlternativeValueProps<Root, Value>) {
		const uniqueValues = uniqueMappedValues(providerMap, property, identifier);
		if (uniqueValues.length > 1) {
			return (
				<ul class='alt-values'>
					{uniqueValues.map(
						([value, providerNames]) => (
							<li>
								{display ? display(value) : value}
								{providerNames.map((name) => <ProviderIcon providerName={name} stroke={1.25} key={name} />)}
							</li>
						),
					)}
				</ul>
			);
		} else {
			return null;
		}
	};
}
