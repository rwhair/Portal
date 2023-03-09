import {
	Formik,
	FormikActions,
	FormikConfig,
	FormikProps,
	FormikValues,
	validateYupSchema,
	yupToFormErrors,
	FormikErrors,
} from "formik";
import React from "react";
import * as yup from "yup";

export class PortalState<T extends object = FormikValues> {
	public constructor(public context: FormikProps<T>, public validationSchema: yup.Schema<T>) {}

	public get values() {
		return this.context.values;
	}

	public validate(path: string) {
		try {
			this.validationSchema.validateSyncAt(path, this.context.values, {
				context: { values: this.context.values },
			});
		} catch (error) {
			return false;
		}
		return true;
	}
}

export function requiredIf<T extends object = FormikValues>(callback: (values: T) => boolean) {
	return (values: T, schema: yup.Schema<any>) => {
		return callback(values) ? schema.required("Required") : schema.notRequired();
	};
}

const PortalContext = React.createContext<PortalState<any>>({} as PortalState<FormikValues>);

export function usePortal<T extends object = FormikValues>() {
	return React.useContext(PortalContext) as PortalState<T>;
}

function formikReset<T>(values: T, actions: FormikActions<T>) {}
function formikSubmit<T>(values: T, actions: FormikActions<T>) {}

export interface PortalProps<T extends object = FormikValues>
	extends Pick<FormikConfig<T>, "initialValues" | "validationSchema"> {
	children?: React.ReactNode;
}

export default function Portal<T extends object = FormikValues>(props: PortalProps<T>) {
	const { children, validationSchema, ...formikProps } = props;

	function validate(values: T) {
		try {
			validateYupSchema<T>(values, validationSchema, true, { values: values });
		} catch (error) {
			return yupToFormErrors<T>(error);
		}

		return {} as FormikErrors<T>;
	}

	return (
		<Formik onReset={formikReset} onSubmit={formikSubmit} validate={validate} {...formikProps}>
			{(formik: FormikProps<T>) => (
				<PortalContext.Provider value={new PortalState(formik, props.validationSchema)}>
					<form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
						{children}
					</form>
				</PortalContext.Provider>
			)}
		</Formik>
	);
}
