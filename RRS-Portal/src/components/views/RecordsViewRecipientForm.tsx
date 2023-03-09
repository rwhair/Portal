import { Typography } from "@material-ui/core";
import React from "react";
import TextInput from "../input/TextInput";
import Item from "../layout/Item";
import { usePortal } from "../portal/Portal";
import { RecordsViewValues } from "./RecordsView";

function PatientRecipientForm() {
	return null;
	/*
	return (
		<React.Fragment>
			<Item>
				<Typography variant="overline">Patient's Information</Typography>
			</Item>
			<TextInput
				sm={6}
				name="records.patient.firstName"
				label="Patient's First Name"
				disabled
				required
			/>
			<TextInput
				sm={6}
				name="records.patient.lastName"
				label="Patient's Last Name"
				disabled
				required
			/>
		</React.Fragment>
	);
	*/
}

function DoctorRecipientForm() {
	const form = usePortal<RecordsViewValues>();

	return (
		<React.Fragment>
			<Item>
				<Typography variant="overline">Physician's Information</Typography>
			</Item>
			<TextInput
				name="records.doctor.facility"
				label="Practice or Medical Facility Name"
				required={!form.values.records.doctor.lastName}
			/>
			<TextInput
				sm={6}
				name="records.doctor.firstName"
				label="Physician's First Name"
			/>
			<TextInput
				sm={6}
				name="records.doctor.lastName"
				label="Physician's Last Name"
				required={!form.values.records.doctor.facility}
			/>
		</React.Fragment>
	);
}

function ThirdPartyRecipientForm() {
	const form = usePortal<RecordsViewValues>();
	return (
		<React.Fragment>
			<Item>
				<Typography variant="overline">Third Party Information</Typography>
			</Item>
			<TextInput
				name="records.thirdParty.company"
				label="Company Name"
				required={!form.values.records.thirdParty.lastName}
			/>
			<TextInput
				sm={6}
				name="records.thirdParty.firstName"
				label="Contact Person's First Name"
			/>
			<TextInput
				sm={6}
				name="records.thirdParty.lastName"
				label="Contact Person's Last Name"
				required={!form.values.records.thirdParty.company}
			/>
		</React.Fragment>
	);
}

export default function RecordsViewRecipientForm() {
	const portal = usePortal<RecordsViewValues>();
	switch (portal.values.records.recipient) {
		case "P":
			return <PatientRecipientForm />;
		case "D":
			return <DoctorRecipientForm />;
		case "T":
			return <ThirdPartyRecipientForm />;
		default:
			return null;
	}
}
