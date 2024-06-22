import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Key } from 'react-aria-components';

export type ComboboxProps<Option> = {
	// ComponentProps<typeof Button> &
	data: Option[]; // | readonly Option[];
	value: Option;
	onChange: (value: Option) => void;
	handleClearOnReselect?: (
		selected: Option,
		setSelected: (value: Option) => void
	) => void;
	getDisplay?: (value: Option) => ReactNode;
	getOptionLabel?: (option: Option) => string;
	getOptionKey?: (option: Option) => Key;
	controlId?: string;
	//
	externalQuery?: [
		query: string | undefined,
		setQuery: (UpdaterOrValue: string | undefined) => void
	];
	debounceTime?: number;
	disabled?: boolean;
	isLoading?: boolean;
	['aria-describedby']?: string;
	name?: string;
	openStateControl?: [
		isOpen: boolean,
		setOpen: Dispatch<SetStateAction<boolean>>
	];
};
