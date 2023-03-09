import { Typography } from "@material-ui/core";
import React from "react";
import PhoneInput from "../input/PhoneInput";
import SelectInput from "../input/SelectInput";
import TextInput from "../input/TextInput";
import Item from "../layout/Item";
import { usePortal } from "../portal/Portal";
import states from "./assets/states.json";
import { RecordsViewValues } from "./RecordsView";
import ZipCodeInput from "../input/ZipCodeInput";

function PatientDestinationForm() {
	const portal = usePortal<RecordsViewValues>();
	const deliveryMethod = portal.values.records.deliveryMethod;
	const patient = portal.values.patient;
	return (
		<React.Fragment>
			{deliveryMethod !== "M" ? null : (
				<React.Fragment>
					<Item>
						<Typography variant="overline">Patient's Contact Information</Typography>
					</Item>
					<TextInput sm={6} name="records.patient.address" label="Address" required />
					<TextInput sm={6} name="records.patient.addressLine2" label="Address Line 2" />
					<TextInput sm={6} name="records.patient.city" label="City" required />
					<SelectInput
						xs={6}
						sm={3}
						name="records.patient.state"
						label="State"
						select
						required
						options={states}
					/>
					<ZipCodeInput
						xs={6}
						sm={3}
						name="records.patient.zipCode"
						label="ZIP Code"
						required
					/>
				</React.Fragment>
			)}
			{deliveryMethod !== "F" ? null : (
				<React.Fragment>
					<Item>
						<Typography variant="overline">Patient's Contact Information</Typography>
					</Item>
					<PhoneInput name="records.patient.fax" label="Fax" required/>
					<PhoneInput name="records.patient.confirmFax" label="Confirm Fax" required/>
				</React.Fragment>
			)}
			{(deliveryMethod === "E" && !patient.email) ? (
				<React.Fragment>
					<Item>
						<Typography variant="overline">Patient's Contact Information</Typography>
					</Item>
					<TextInput name="records.patient.email" label="Email" required />
					<TextInput name="records.patient.confirmEmail" label="Confirm Email" required/>
				</React.Fragment>
			) : null }
		</React.Fragment>
	);
}

function DoctorDestinationForm() {
	const portal = usePortal<RecordsViewValues>();
	const deliveryMethod = portal.values.records.deliveryMethod;
	return (
		<React.Fragment>
			{!deliveryMethod ? null : (
				<Item>
					<Typography variant="overline">Physician's Contact Information</Typography>
				</Item>
			)}
			{deliveryMethod !== "M" ? null : (
				<React.Fragment>
					<TextInput sm={6} name="records.doctor.address" label="Address" required />
					<TextInput sm={6} name="records.doctor.addressLine2" label="Address Line 2" />
					<TextInput sm={6} name="records.doctor.city" label="City" required />
					<SelectInput
						xs={6}
						sm={3}
						name="records.doctor.state"
						label="State"
						select
						required
						options={states}
					/>
					<ZipCodeInput
						xs={6}
						sm={3}
						name="records.doctor.zipCode"
						label="ZIP Code"
						required
					/>
				</React.Fragment>
			)}
			{deliveryMethod !== "F" ? null : (
				<React.Fragment>
					<PhoneInput name="records.doctor.fax" label="Fax" required/>
					<PhoneInput name="records.doctor.confirmFax" label="Confirm Fax" required/>
				</React.Fragment>
			)}
			{deliveryMethod !== "E" ? null : (
				<React.Fragment>
					<TextInput name="records.doctor.email" label="Email" required />
					<TextInput name="records.doctor.confirmEmail" label="Confirm Email" required/>
				</React.Fragment>
			)}
		</React.Fragment>
	);
}

function ThirdPartyDestinationForm() {
	const portal = usePortal<RecordsViewValues>();
	const deliveryMethod = portal.values.records.deliveryMethod;
	return (
		<React.Fragment>
			{!deliveryMethod ? null : (
				<Item>
					<Typography variant="overline">Third Party Contact Info</Typography>
				</Item>
			)}
			{deliveryMethod !== "M" ? null : (
				<React.Fragment>
					<TextInput sm={6} name="records.thirdParty.address" label="Address" required />
					<TextInput
						sm={6}
						name="records.thirdParty.addressLine2"
						label="Address Line 2"
					/>
					<TextInput sm={6} name="records.thirdParty.city" label="City" required />
					<SelectInput
						xs={6}
						sm={3}
						name="records.thirdParty.state"
						label="State"
						select
						required
						options={states}
					/>
					<ZipCodeInput
						xs={6}
						sm={3}
						name="records.thirdParty.zipCode"
						label="ZIP Code"
						required
					/>
				</React.Fragment>
			)}
			{deliveryMethod !== "F" ? null : (
				<React.Fragment>
					<PhoneInput name="records.thirdParty.fax" label="Fax" required/>
					<PhoneInput name="records.thirdParty.confirmFax" label="Confirm Fax" required/>
				</React.Fragment>
			)}
			{deliveryMethod !== "E" ? null : (
				<React.Fragment>
					<TextInput name="records.thirdParty.email" label="Email" required/>
					<TextInput name="records.thirdParty.confirmEmail" label="Confirm Email" required/>
				</React.Fragment>
			)}
		</React.Fragment>
	);
}

export default function RecordsViewDestinationForm() {
	const portal = usePortal<RecordsViewValues>();
	switch (portal.values.records.recipient) {
		case "P":
			return <PatientDestinationForm />;
		case "D":
			return <DoctorDestinationForm />;
		case "T":
			return <ThirdPartyDestinationForm />;
		default:
			return null;
	}
}
