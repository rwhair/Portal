import React from "react";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import Item, { ItemProps, getItemProps } from "../layout/Item";
import { FormControlLabel } from "@material-ui/core";
import { Field, FieldProps } from "formik";

export interface CheckboxInputProps extends ItemProps, CheckboxProps {
	label?: React.ReactNode;
	checkbox?: any;
}

export default function CheckboxInput(props: CheckboxInputProps) {
	const [{ children, ...itemProps }, { name, label, ...checkbox }] = getItemProps(props);
	return (
		<Item {...itemProps}>
			<FormControlLabel
				label={label}
				control={
					<Field name={name}>
						{(props: FieldProps) => {
							const { field} = props;
							return (
								<Checkbox
									{...field}
									{...checkbox}
									color="primary"
									value={field.value}
									checked={!!field.value}
								/>
							);
						}}
					</Field>
				}
			/>
		</Item>
	);
}
