import React from "react";
import RadioGroup, { RadioGroupProps } from "@material-ui/core/RadioGroup";
import Item, { ItemProps, getItemProps } from "../layout/Item";
import { Field, FieldProps } from "formik";
import InputOption from "./InputOption";
import { FormControlLabel, Radio } from "@material-ui/core";

export interface RadioInputProps extends ItemProps, RadioGroupProps {
	options?: InputOption[];
}

export default function RadioInput(props: RadioInputProps) {
	const [{ children, ...itemProps }, { options, ...radioGroupProps }] = getItemProps(props);
	return (
		<Item {...itemProps}>
			<Field name={radioGroupProps.name}>
				{(props: FieldProps) => {
					const { field } = props;
					return (
						<RadioGroup {...field} {...radioGroupProps}>
							{!options
								? null
								: options.map((option, key) => (
										<FormControlLabel
											key={key}
											label={option.label}
											value={option.value}
											control={<Radio color="primary" />}
										/>
								  ))}
						</RadioGroup>
					);
				}}
			</Field>
		</Item>
	);
}
