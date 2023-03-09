import { Typography, Box, Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import Container from "../layout/Container";
import Item from "../layout/Item";
import { PortalState, usePortal } from "../portal/Portal";
import { RequestPortalValues } from "../portal/RequestPortal";
import RadioInput from "../input/RadioInput";
import paymentTypeOptions from "./assets/paymentTypeOptions.json";
import PaymentCreditCardForm from "./PaymentCreditCardForm";
import PaymentBankAccountForm from "./PaymentBankAccountForm";
//import { calculateTotalCost } from "../../lib/calculateTotalCost";
import { PricingTable, SendTo, InfoRequested, DeliveryMethod, DeliveryTimeframe } from "../../lib/PricingTable";


import TextInput from "../input/TextInput";
import CheckboxInput from "../input/CheckboxInput";
import FormContext from "../../context/formTypeContext";
import ReCAPTCHA from "react-google-recaptcha";
import { info } from "console";

const RECAPTCHA_KEY: string = "6Lf4dNYUAAAAADWNx57-Z1e1qrhAtlf-Nq_0A1Le";

export const SummaryViewInitialValues = {
	summary: {
		email: "",
		confirmEmail: "",
		emailSameAsPatient: false,
		acknowledge: false,
		signature: "",
		payment: {
			type: "",
			creditCard: {
				number: "",
				name: "",
				expDate: "",
				securityCode: "",
				firstName: "",
				lastName: "",
				address: "",
				addressLine2: "",
				city: "",
				state: "",
				zipCode: "",
			},
			bankTransfer: {
				accountType: "",
				accountName: "",
				routingNumber: "",
				accountNumber: "",
				bankName: "",
				checkNumber: "",
				amount: "",
				firstName: "",
				lastName: "",
				address: "",
				addressLine2: "",
				city: "",
				state: "",
				zipCode: "",
			},
		},
	},
};

export type SummaryViewValues = typeof SummaryViewInitialValues;

function getInfoRequested(portal: PortalState<RequestPortalValues>) {
	let infoRequested = "";

	switch (portal.values.records.infoRequested) {
		case "R":
			infoRequested = "Records";
			break;
		case "F":
			infoRequested = "Films";
			break;
		case "B":
			infoRequested = "Bills";
			break;
		case "RF":
			infoRequested = "Records and Films";
			break;
		case "RFB":
			infoRequested = "Records, Films, and Bills";
			break;
		case "D":
			infoRequested = "Disability Forms";
			break;
	}

	infoRequested += portal.values.records.startDate
		? " from " + portal.values.records.startDate
		: "";

	return (
		<React.Fragment>
			<Typography variant="body1" color="textSecondary">
				{infoRequested}
			</Typography>
			<Typography variant="body1" color="textSecondary" paragraph>
				{portal.values.records.specificInfoRequested}
			</Typography>
		</React.Fragment>
	);
}

type PatientInfo = RequestPortalValues["records"]["patient"];
type DoctorInfo = RequestPortalValues["records"]["doctor"];
type ThirdPartyInfo = RequestPortalValues["records"]["thirdParty"];
type RecipientInfo = PatientInfo | DoctorInfo | ThirdPartyInfo;

function getRecipientInfo(values: RequestPortalValues) {
	switch (values.records.recipient) {
		case "P":
			return { ...values.records.patient, email: values.patient.email };
		case "D":
			return values.records.doctor;
		case "T":
			return values.records.thirdParty;
		default:
			return {} as RecipientInfo;
	}
}

function getRecipientContactInfo(values: RequestPortalValues) {
	let contact = getRecipientInfo(values);
	switch (values.records.deliveryMethod) {
		case "E":
			return (
				<React.Fragment>
					<Typography variant="body2" color="textPrimary">
						Email
          </Typography>
					<Typography variant="body2" color="textSecondary" paragraph>
						{contact.email || null}
					</Typography>
				</React.Fragment>
			);
		case "F":
			return (
				<React.Fragment>
					<Typography variant="body2" color="textPrimary">
						Fax
          </Typography>
					<Typography variant="body2" color="textSecondary" paragraph>
						{contact.fax || null}
					</Typography>
				</React.Fragment>
			);
		case "M":
			return (
				<React.Fragment>
					<Typography variant="body2" color="textPrimary">
						Address
          </Typography>
					<Typography variant="body2" color="textSecondary">
						{contact.address || null}
					</Typography>
					<Typography variant="body2" color="textSecondary">
						{contact.addressLine2 || null}
					</Typography>
					<Typography variant="body2" color="textSecondary" paragraph>
						{contact.city && contact.state && contact.zipCode
							? contact.city + ", " + contact.state + "  " + contact.zipCode
							: null}
					</Typography>
				</React.Fragment>
			);
		default:
			return null;
	}
}

function getRecipientName(values: RequestPortalValues) {
	let contact = getRecipientInfo(values);
	if (values.records.recipient === "P") {
		return (
			<React.Fragment>
				<Typography variant="body1" color="textPrimary" paragraph>
					You
        </Typography>
			</React.Fragment>
		);
	}
	return (
		<React.Fragment>
			<Typography variant="body1" color="textPrimary">
				{contact.firstName && contact.lastName
					? contact.firstName + " " + contact.lastName
					: null}
			</Typography>
			<Typography variant="body1" color="textSecondary" paragraph>
				{(contact as DoctorInfo).facility ||
					(contact as ThirdPartyInfo).company || null}
			</Typography>
		</React.Fragment>
	);
}

function getRecipient(portal: PortalState<RequestPortalValues>) {
	return (
		<React.Fragment>
			{getRecipientName(portal.values)}
			{getRecipientContactInfo(portal.values)}
		</React.Fragment>
	);
}

function getPatientInformation(portal: PortalState<RequestPortalValues>) {
	return (
		<React.Fragment>
			<Typography variant="body1" color="textPrimary" paragraph>
				{portal.values.patient.firstName && portal.values.patient.lastName
					? portal.values.patient.firstName + " " +
					portal.values.patient.lastName
					: null}
			</Typography>
			<Typography variant="body2" color="textPrimary">
				Date of Birth
      </Typography>
			<Typography variant="body2" color="textSecondary" paragraph>
				{portal.values.patient.dateOfBirth || null}
			</Typography>
			<Typography variant="body2" color="textPrimary">
				Phone Number
      </Typography>
			<Typography variant="body2" color="textSecondary" paragraph>
				{portal.values.patient.phoneNumber || null}
			</Typography>
		</React.Fragment>
	);
}

function getDoctorInformation(portal: PortalState<RequestPortalValues>) {
	return (
		<React.Fragment>
			<Typography variant="body1" color="textPrimary">
				{portal.values.doctor.firstName && portal.values.doctor.lastName
					? portal.values.doctor.firstName + " " + portal.values.doctor.lastName
					: null}
			</Typography>
			<Typography variant="body1" color="textSecondary" paragraph>
				{portal.values.doctor.facility || null}
			</Typography>
			<Typography variant="body2" color="textPrimary">
				Phone Number
      </Typography>
			<Typography variant="body2" color="textSecondary" paragraph>
				{portal.values.doctor.phoneNumber || null}
			</Typography>
			<Typography variant="body2" color="textPrimary">
				Address
      </Typography>
			<Typography variant="body2" color="textSecondary">
				{portal.values.doctor.address || null}
			</Typography>
			<Typography variant="body2" color="textSecondary">
				{portal.values.doctor.addressLine2 || null}
			</Typography>
			<Typography variant="body2" color="textSecondary" paragraph>
				{portal.values.doctor.city && portal.values.doctor.state &&
					portal.values.doctor.zipCode
					? portal.values.doctor.city +
					", " +
					portal.values.doctor.state +
					"  " +
					portal.values.doctor.zipCode
					: null}
			</Typography>
		</React.Fragment>
	);
}

function emailFields(portal: PortalState<RequestPortalValues>) {
	if (!portal.values.summary.emailSameAsPatient) {
		return (
			<React.Fragment>
				<TextInput name="summary.email" label="Requestor's Email" required />
				<TextInput
					name="summary.confirmEmail"
					label="Confirm Requestor's Email"
					required
				/>
			</React.Fragment>
		);
	} else {
		if (portal.values.patient.email) {
			return (
				<React.Fragment>
					<TextInput
						name="patient.email"
						label="Requestor's Email"
						required
						disabled
					/>
					<TextInput
						name="patient.confirmEmail"
						label="Confirm Requestor's Email"
						required
						disabled
					/>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<TextInput
						name="records.patient.email"
						label="Requestor's Email"
						required
						disabled
					/>
					<TextInput
						name="records.patient.confirmEmail"
						label="Confirm Requestor's Email"
						required
						disabled
					/>
				</React.Fragment>
			);
		}
	}
}

export default function SummaryView() {
	const portal = usePortal<RequestPortalValues>();
	const formType = useContext(FormContext);
	const description: string = formType.value === "disabilityForms"
		? "I, the requestor for this Disability Form Submission warrant the truthfulness of the information provided in this application."
		: "I, the requestor for this Medical Record Release of Information Form warrant the truthfulness of the information provided in this application.";

	const recaptchaCallback = (token: any): void => {
		debugger;
		portal.context.setFieldValue("summary.token", token);
	};

	useEffect(() => {
		const sendTo = portal.values.records.recipient as SendTo;
		const infoRequested = portal.values.records.infoRequested as InfoRequested;
		const deliveryMethod = portal.values.records.deliveryMethod as DeliveryMethod;
		const deliveryTimeframe = portal.values.records.timeframe as DeliveryTimeframe;
		const table = PricingTable.get();
		const totalCost = table.getTotalCost(sendTo, infoRequested, deliveryMethod, deliveryTimeframe);
		portal.context.setFieldValue(
			"summary.payment.bankTransfer.amount",
			totalCost.toString()
		);
		return () => { };
	}, []);

	const sendTo = portal.values.records.recipient as SendTo;
	const infoRequested = portal.values.records.infoRequested as InfoRequested;
	const deliveryMethod = portal.values.records.deliveryMethod as DeliveryMethod;
	const deliveryTimeframe = portal.values.records.timeframe as DeliveryTimeframe;
	const table = PricingTable.get();
	const totalCost = table.getTotalCost(sendTo, infoRequested, deliveryMethod, deliveryTimeframe);

	return (
		<Container>
			<Item>
				<Typography variant="subtitle2">Review your request</Typography>
				<Typography variant="body1" color="textSecondary">
					Please review the details of your request below for accuracy before
					submitting.
        </Typography>
			</Item>
			<Item sm={4}>
				<Typography variant="overline">Information Requested</Typography>
				{getInfoRequested(portal)}
				<Typography variant="overline">Send To</Typography>
				{getRecipient(portal)}
			</Item>
			<Item sm={4}>
				<Typography variant="overline">For Patient</Typography>
				{getPatientInformation(portal)}
			</Item>
			<Item xs={4}>
				<Typography variant="overline">From Physician</Typography>
				{getDoctorInformation(portal)}
			</Item>
			{!totalCost ? null : (
				<React.Fragment>
					<Item>
						<Typography variant="subtitle2">Payment Information</Typography>
						<Typography variant="body1" color="textSecondary">
							Please provide your payment information below.
            </Typography>
					</Item>
					<Item>
						<Typography variant="h6" color="textPrimary">
							Total Cost: {"$" + totalCost.toFixed(2)}
						</Typography>
						<RadioInput
							row
							name="summary.payment.type"
							options={paymentTypeOptions}
						/>
					</Item>
					{portal.values.summary.payment.type === "C"
						? <PaymentCreditCardForm />
						: null}
					{portal.values.summary.payment.type === "B"
						? <PaymentBankAccountForm />
						: null}
				</React.Fragment>
			)}
			<Item>
				<Typography variant="h6" paragraph>
					Confirmation Email
        </Typography>
				<Typography variant="body1" color="textSecondary">
					Enter your email address below. You will receive a confirmation email
					once your request has been received.
        </Typography>
			</Item>
			<CheckboxInput name="summary.emailSameAsPatient" label="Same As Patient" />
			{emailFields(portal)}
			<Item>
				<Typography variant="h6" paragraph>
					Terms of Acceptance &amp; Signature
        </Typography>
				<Typography variant="body1" color="textSecondary" paragraph>
					{description}
				</Typography>
			</Item>
			<Item>
				<Typography variant="overline" paragraph>
					Electronic Signature
        </Typography>
				<TextInput
					name="summary.signature"
					label="First &amp; Last Name"
					required
				/>
			</Item>
			<Item>
				<Box display="flex" flexDirection="row" justifyContent="flex-start">
					<ReCAPTCHA sitekey={RECAPTCHA_KEY} onChange={recaptchaCallback} />
				</Box>
			</Item>
			<Item>
				<Box display="flex" flexDirection="row" justifyContent="flex-start">
					<CheckboxInput
						name="summary.acknowledge"
						label="I understand that checking this box constitutes a legal signature confirming
						that I acknowledge and agree to the above terms of acceptance."
					/>
				</Box>
			</Item>
		</Container>
	);
}
