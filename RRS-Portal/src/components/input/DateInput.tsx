import React from "react";
import TextInput, { TextInputProps } from "./TextInput";
import MaskedInput from "react-text-mask";

const dateInputMask = [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];

function MaskedDateInput(props: any) {
	const { inputRef, ...other } = props;
	return (
		<MaskedInput
			{...other}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={dateInputMask}
			placeholderChar="_"
		/>
	);
}

export interface DateInputProps extends TextInputProps {}

export default function DateInput(props: DateInputProps) {
	return <TextInput {...props} InputProps={{ inputComponent: MaskedDateInput }} />;
}
