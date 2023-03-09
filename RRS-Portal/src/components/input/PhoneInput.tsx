import React from "react";
import TextInput, { TextInputProps } from "./TextInput";
import MaskedInput from "react-text-mask";

const phoneInputMask = [
	"(",
	/\d/,
	/\d/,
	/\d/,
	")",
	" ",
	/\d/,
	/\d/,
	/\d/,
	"-",
	/\d/,
	/\d/,
	/\d/,
	/\d/,
];

function MaskedPhoneInput(props: any) {
	const { inputRef, ...other } = props;
	return (
		<MaskedInput
			{...other}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={phoneInputMask}
			placeholderChar="_"
		/>
	);
}

export interface PhoneInputProps extends TextInputProps {}

export default function PhoneInput(props: PhoneInputProps) {
	return <TextInput {...props} InputProps={{ inputComponent: MaskedPhoneInput }} />;
}
