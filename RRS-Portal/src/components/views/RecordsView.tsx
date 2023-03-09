import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import DateInput from "../input/DateInput";
import RadioInput from "../input/RadioInput";
import SelectInput from "../input/SelectInput";
import TextInput from "../input/TextInput";
import Container from "../layout/Container";
import Item from "../layout/Item";
import { usePortal } from "../portal/Portal";
import RecordsViewDestinationForm from "./RecordsViewDestinationForm";
import RecordsViewRecipientForm from "./RecordsViewRecipientForm";
//import { getBaseCharge, getDeliveryCharge } from "../../lib/calculateTotalCost";
import { PricingTable, SendTo, InfoRequested, DeliveryMethod, DeliveryTimeframe } from "../../lib/PricingTable";
import FormTypeContext from '../../context/formTypeContext';

function getRecipientOptions() {
	return [
		{ value: "P", label: "Send to Me" },
		{ value: "D", label: "Send to Doctor" },
		{ value: "T", label: "Send to Third Party" },
	];
}

function getInfoRequestedOptions() {
	return [
		{ value: "R", label: "Records" },
		{ value: "F", label: "Films" },
		{ value: "B", label: "Bills" },
		{ value: "RF", label: "Both Records and Films" },
		{ value: "RFB", label: "All - Records, Films, and Bills" },
		{ value: "D", label: "Need a Disability Form completed" },
	];
}

function getInfoRequestedOptionsForDisability() {
	return [
		{ value: "D", label: "Need a Disability Form completed" },
	];
}

function getReasonForReleaseOptions() {
	return [
		{ value: "Continuing Care", label: "Continuing Care" },
		{ value: "Transfer Care", label: "Transfer Care" },
		{ value: "Second Opinion", label: "Second Opinion" },
		{ value: "Personal", label: "Personal" },
		{ value: "Litigation", label: "Litigation" },
		{ value: "Insurance Underwriting", label: "Insurance Underwriting" },
		{ value: "Insurance Claim", label: "Insurance Claim" },
		{ value: "Undisclosed", label: "Undisclosed" },
		{ value: "Disability Form", label: "Disability Form" },
	];
}

function getDeliveryMethodOptions(sendTo: string, infoRequested: string, deliveryTimeframe: string) {
	const table = PricingTable.get();
	const baseCharge = table.getBaseCharge(sendTo as SendTo, infoRequested as InfoRequested, deliveryTimeframe as DeliveryTimeframe);
	const resultArray: object[] = [];
	getDeliveryOptions().forEach((deliveryMethod) => {
		const deliveryCharge = PricingTable.get().getDeliveryCharge(sendTo as SendTo, infoRequested as InfoRequested, deliveryMethod.value as DeliveryMethod, deliveryTimeframe as DeliveryTimeframe);
		if (!isNaN(deliveryCharge)) {
			resultArray.push({
				value: deliveryMethod.value,
				label: `${deliveryMethod.label} - $${baseCharge.toFixed(2)} + $${deliveryCharge.toFixed(2)} (expedite fee) = $${(baseCharge + deliveryCharge).toFixed(2)} Total Cost`
			})
		}
	});
	return resultArray;
}

function getTimeFrameOptions() {
	return [
		{ value: "F", label: "5 - 7 days" },
		{ value: "S", label: "7 - 10 days" },
	];
}

function getDeliveryOptions() {
	return [
		{ value: 'E', label: 'Electronic' },
		{ value: 'F', label: 'Fax' },
		{ value: 'M', label: 'Mail' }
	];
}

export const RecordsViewInitialValues = {
	records: {
		recipient: "",
		startDate: "",
		endDate: "",
		infoRequested: "",
		reasonForRelease: "",
		specificInfoRequested: "",
		deliveryMethod: "",
		timeframe: "",
		patient: {
			firstName: "",
			lastName: "",
			fax: "",
			confirmFax: '',
			email: "",
			confirmEmail: '',
			address: "",
			addressLine2: "",
			city: "",
			state: "",
			zipCode: "",
		},
		doctor: {
			facility: "",
			firstName: "",
			lastName: "",
			fax: "",
			confirmFax: '',
			email: "",
			confirmEmail: '',
			address: "",
			addressLine2: "",
			city: "",
			state: "",
			zipCode: "",
		},
		thirdParty: {
			company: "",
			firstName: "",
			lastName: "",
			fax: "",
			confirmFax: '',
			email: "",
			confirmEmail: '',
			address: "",
			addressLine2: "",
			city: "",
			state: "",
			zipCode: "",
		},
	},
};

export type RecordsViewValues = {
	patient: {
		aka: string,
		dateOfBirth: string,
		email: string,
		confirmEmail: string,
		firstName: string,
		lastName: string,
		phoneNumber: string,
		ssn: string
	},
	records: {
		recipient: string,
		startDate: string,
		endDate: string,
		infoRequested: string,
		reasonForRelease: string,
		specificInfoRequested: string,
		deliveryMethod: string,
		timeframe: string,
		patient: {
			firstName: string,
			lastName: string,
			email: string,
			confirmEmail: string,
			fax: string,
			confirmFax: string,
			address: string,
			addressLine2: string,
			city: string,
			state: string,
			zipCode: string,
		},
		doctor: {
			facility: string,
			firstName: string,
			lastName: string,
			fax: string,
			confirmFax: string,
			email: string,
			confirmEmail: string,
			address: string,
			addressLine2: string,
			city: string,
			state: string,
			zipCode: string,
		},
		thirdParty: {
			company: string,
			firstName: string,
			lastName: string,
			fax: string,
			confirmFax: string,
			email: string,
			confirmEmail: string,
			address: string,
			addressLine2: string,
			city: string,
			state: string,
			zipCode: string,
		},
	},
};

interface IFormContext {
	value: string,
	setFormType: Function
}

export default function RecordsView() {
	const formTypeContext: IFormContext = useContext(FormTypeContext);
	const form = usePortal<RecordsViewValues>();
	const isDisabilityForm: boolean = formTypeContext.value === 'disabilityForms';
	const subtitle: string = isDisabilityForm ? 'Where would you like your form sent?' : 'Where would you like your records sent?';
	const startDateLabel: string = isDisabilityForm ? 'Date of Incident (MM/DD/YYYY)' : 'Records from Date (MM/DD/YYYY)';
	const recipientLabel: string = isDisabilityForm ? 'Specify details of injury or other details required to complete your form' : 'Specific Information Requested (Labs, X-rays, Reports, Office Notes, or Specific Body Parts)';

	return (
		<Container>
			<Item>
				<Typography variant="subtitle2" color="textPrimary">
					{subtitle}
				</Typography>
				<RadioInput name="records.recipient" row options={getRecipientOptions()} />
			</Item>
			<RecordsViewRecipientForm />
			<Item>
				<Typography variant="subtitle2" color="textPrimary">
					What information would you like sent?
				</Typography>
				<Typography variant="body1" color="textSecondary">
					In order to receive the fastest services please specify the information that is
					being requested. Larger files will take longer to process and deliver. Reducing
					requests to the minimum necessary allows RRS to provide the quickest turnaround
					times.
				</Typography>
			</Item>
			<DateInput
				sm={6}
				name="records.startDate"
				label={startDateLabel}
				required
				disabled={!form.values.records.recipient}
			/>
			{
				!isDisabilityForm && (
					<DateInput
						sm={6}
						name="records.endDate"
						label="Records to Date (MM/DD/YYYY)"
						required
						disabled={!form.values.records.recipient}
					/>
				)
			}
			<SelectInput
				sm={6}
				name="records.infoRequested"
				label="What's Requested?"
				options={isDisabilityForm ? getInfoRequestedOptionsForDisability() : getInfoRequestedOptions()}
				required
				disabled={!form.values.records.recipient}
			/>
			{
				!isDisabilityForm && (
					<SelectInput
						sm={6}
						name="records.reasonForRelease"
						label="Reason for Release"
						options={getReasonForReleaseOptions()}
						required
						disabled={!form.values.records.recipient}
					/>
				)
			}
			<TextInput
				xs={12}
				name="records.specificInfoRequested"
				label={recipientLabel}
				disabled={!form.values.records.recipient}
			/>
			<Item>
				<Typography variant="subtitle2" color="textPrimary">
					When would you like your documents?
				</Typography>
				<Typography variant="body1" color="textSecondary">
					Depending on the timeframe you choose the total cost of the transaction will
					change.
				</Typography>
			</Item>
			<SelectInput
				sm={4}
				name="records.timeframe"
				label="Timeframe"
				options={getTimeFrameOptions()}
				required
			/>
			{!form.values.records.timeframe ? null : (
				<RadioInput name="records.deliveryMethod" options={getDeliveryMethodOptions(form.values.records.recipient, form.values.records.infoRequested, form.values.records.timeframe)} />
			)}
			<RecordsViewDestinationForm />
		</Container>
	);
}
