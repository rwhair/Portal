import React from "react";
import TextInput, { TextInputProps } from "./TextInput";
import MaskedInput from "react-text-mask";

const zipCodeInputMask = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];

//not really sure why we need it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MaskedZipCodeInput(props: any) {
	const { inputRef, ...other } = props;
	return (
		<MaskedInput
			{...other}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={zipCodeInputMask}
			placeholderChar="_"
		/>
	);
}

export interface ZipCodeInputProps extends TextInputProps {}

export default function ZipCodeInput(props: ZipCodeInputProps) {
	return <TextInput {...props} />;
}
