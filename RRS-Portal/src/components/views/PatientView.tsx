import { Typography } from "@material-ui/core";
import React from "react";
import DateInput from "../input/DateInput";
import PhoneInput from "../input/PhoneInput";
import TextInput from "../input/TextInput";
import Container from "../layout/Container";
import Item from "../layout/Item";

export const PatientViewInitialValues = {
	patient: {
		firstName: "",
		lastName: "",
		aka: "",
		dateOfBirth: "",
		ssn: "",
		email: "",
		confirmEmail: "",
		phoneNumber: "",
	},
};

export type PatientViewValues = typeof PatientViewInitialValues;

export default function PatientView() {
	return (
		<Container>
			<Item>
				<Typography variant="subtitle2" color="textPrimary">
					Patient Information
				</Typography>
				<Typography variant="body1" color="textSecondary">
					Be sure to complete all the fields so that you can be contacted with any issues
					that may arise. Failure to provide any of these fields may result in delays of
					the delivery of the medical information.
				</Typography>
			</Item>
			<TextInput sm={4} name="patient.firstName" label="Patient's First Name" required />
			<TextInput sm={4} name="patient.lastName" label="Patient's Last Name" required />
			<TextInput sm={4} name="patient.aka" label="AKA or Maiden Name" />
			<DateInput
				sm={6}
				name="patient.dateOfBirth"
				label="Date of Birth (MM/DD/YYYY)"
				required
			/>
			<TextInput sm={6} name="patient.ssn" label="SSN (last 4 digits only)" />
			<TextInput sm={6} name="patient.email" label="Email" />
			<TextInput sm={6} name="patient.confirmEmail" label="Confirm Email" />
			<PhoneInput sm={12} name="patient.phoneNumber" label="Phone Number" required />
		</Container>
	);
}
