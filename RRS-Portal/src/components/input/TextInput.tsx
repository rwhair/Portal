import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import TextField, { FilledTextFieldProps } from "@material-ui/core/TextField";
import { Field, FieldProps, getIn } from "formik";
import React from "react";
import Item, { getItemProps, ItemProps } from "../layout/Item";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			borderWidth: 1,
			borderStyle: "solid",
			borderColor: theme.palette.background.default,
			borderRadius: theme.shape.borderRadius,
			backgroundColor: theme.palette.divider,
			transition: theme.transitions.create(["border-color", "box-shadow"]),
			"&:hover": {
				backgroundColor: theme.palette.background.default,
			},
			"&.focused": {
				backgroundColor: theme.palette.background.default,
				boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
				borderColor: theme.palette.primary.main,
			},
		},
	})
);

export interface TextInputProps extends ItemProps, Omit<FilledTextFieldProps, "variant"> {}

export default function TextInput(props: TextInputProps) {
	const classes = useStyles();
	const [{ children, ...item }, { onChange, ...textField }] = getItemProps(props);
	return (
		<Item {...item}>
			<Field name={textField.name}>
				{(formik: FieldProps) => {
					const { form, field } = formik;
					const errorText = getIn(form.errors, field.name);
					const showErrorText = !!getIn(form.touched, field.name) && !!errorText;

					return (
						<TextField
							{...textField}
							fullWidth
							disabled={textField.disabled || form.isSubmitting}
							error={showErrorText}
							helperText={showErrorText ? errorText : textField.helperText}
							variant="filled"
							InputProps={{
								classes: { root: classes.root, focused: "focused" },
								disableUnderline: true,
								...textField.InputProps,
							}}
							children={children}
							{...field}
						/>
					);
				}}
			</Field>
		</Item>
	);
}
