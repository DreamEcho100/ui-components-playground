'use client';

import { Combobox } from '~/components/ui/combobox';
import ShowcaseArticle from '../article';
import { useState } from 'react';

export default function ComboboxesShowSase() {
	const [values, setValues] = useState({
		default: '',
		disabled: ''
	});
	return (
		<ShowcaseArticle
			header={{
				title: 'Comboboxes',
				description: [
					'Comboboxes are used to select an item from a list.',
					'They can be disabled.',
					'They can be used with a custom query function to filter the list of options or to fetch the list of options.',
					'They can be used with a custom function to (display to display the selected value, label to display the options, and key to identify the option), as it will be using the option itself by default',
					'So if the options are objects or you want to customize them more you can use these functions (`getOptionLabel`, `getOptionKey`, `getDisplay`).'
				]
			}}
			sections={[
				{
					title: 'Default',
					description: 'A default combobox.',
					content: (
						<Combobox
							data={['Option 1', 'Option 2', 'Option 3']}
							// getOptionLabel={(option) => option}
							// getDisplay={(value) => value ?? 'Select ...'}
							// getOptionKey={(option) => option}
							value={values.default}
							onChange={(value) =>
								setValues((prev) => ({ ...prev, default: value }))
							}
						/>
					)
				},
				{
					title: 'Disabled',
					description: 'A disabled combobox.',
					content: (
						<Combobox
							data={['Option 1', 'Option 2', 'Option 3']}
							value={values.disabled}
							onChange={(value) =>
								setValues((prev) => ({ ...prev, disabled: value }))
							}
							disabled
						/>
					)
				}
			]}
		/>
	);
}
