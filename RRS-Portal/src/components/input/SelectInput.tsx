import React from "react";
import TextInput, { TextInputProps } from "./TextInput";
import InputOption from "./InputOption";
import { MenuItem } from "@material-ui/core";

export interface SelectInputProps extends TextInputProps {
	options?: InputOption<string>[];
}

export default function SelectInput(props: SelectInputProps) {
	const { options, children, ...inputProps } = props;
	return (
		<TextInput {...inputProps} select>
			{!options
				? null
				: options.map((option, key) => (
						<MenuItem key={key} value={option.value} children={option.label} />
				  ))}
		</TextInput>
	);
}
