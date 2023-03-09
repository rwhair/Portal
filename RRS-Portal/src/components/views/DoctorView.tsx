import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import SelectInput from "../input/SelectInput";
import TextInput from "../input/TextInput";
import Container from "../layout/Container";
import Item from "../layout/Item";
import states from "./assets/states.json";
import ZipCodeInput from "../input/ZipCodeInput";
import PhoneInput from "../input/PhoneInput";
import { usePortal } from "../portal/Portal";
import { DoctorViewValues } from "./DoctorView";
import FormContext from '../../context/formTypeContext'

export const DoctorViewInitialValues = {
	doctor: {
		facility: "",
		firstName: "",
		lastName: "",
		phoneNumber: "",
		fax: "",
		address: "",
		addressLine2: "",
		city: "",
		state: "",
		zipCode: "",
	},
};

export type DoctorViewValues = typeof DoctorViewInitialValues;

export default function DoctorView() {
	const form = usePortal<DoctorViewValues>();
	const formType = useContext(FormContext);
	const subtitle : string = formType.value === 'disabilityForms' ? 'Doctor who is overseeing your disability' : 'Doctor or facility you would like information from' ;

	return (
		<Container>
			<Item>
				<Typography variant="subtitle2" color="textPrimary">
					{ subtitle }
				</Typography>
			</Item>
			<TextInput
				name="doctor.facility"
				label="Practice or Medical Facility Name"
				required={!form.values.doctor.lastName}
			/>
			<Item>
				<Typography variant="overline">Physician's Information</Typography>
			</Item>
			<TextInput sm={6} name="doctor.firstName" label="Physician's First Name" />
			<TextInput
				sm={6}
				name="doctor.lastName"
				label="Physician's Last Name"
				required={!form.values.doctor.facility}
			/>
			<PhoneInput sm={6} name="doctor.phoneNumber" label="Phone Number" required />
			<PhoneInput sm={6} name="doctor.fax" label="Fax" />
			<Item>
				<Typography variant="overline">Physician's Address</Typography>
			</Item>
			<TextInput sm={6} name="doctor.address" label="Address" required />
			<TextInput sm={6} name="doctor.addressLine2" label="Address Line 2" />
			<TextInput sm={6} name="doctor.city" label="City" required />
			<SelectInput
				xs={6}
				sm={3}
				name="doctor.state"
				label="State"
				options={states}
				required
			/>
			<ZipCodeInput xs={6} sm={3} name="doctor.zipCode" label="ZIP Code" required />
		</Container>
	);
}
