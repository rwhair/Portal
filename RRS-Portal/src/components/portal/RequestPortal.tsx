import { Box, Button, Divider, Typography } from "@material-ui/core";
import { getIn } from "formik";
import { get } from "lodash";
import React, { useContext } from "react";
import DoctorView, { DoctorViewInitialValues } from "../views/DoctorView";
import PatientView, { PatientViewInitialValues } from "../views/PatientView";
import RecordsView, { RecordsViewInitialValues } from "../views/RecordsView";
import SummaryView, { SummaryViewInitialValues } from "../views/SummaryView";
import UploadView, { UploadViewInitialValues } from "../views/UploadView";
import { RequestTypeInitialValues } from "../views/RequestTypeView";
import Wizard from "../widgets/Wizard";
import { usePortal } from "./Portal";
import TotalCost from "../widgets/TotalCost";
import RequestPortalSubmitSuccess from "./RequestPortalSubmitSuccess";
import { getUrlWithParams, suveryAmount } from "../../lib/surveyUrl";
import FormContext from "../../context/formTypeContext";
import axios from "axios";
import RequestPortalSubmitFail from "./RequestPortalSubmitFail";

export const API_SERVER = ""; //"https://request.rrsmedical.com";

export const RequestPortalInitialValues = {
	...PatientViewInitialValues,
	...RecordsViewInitialValues,
	...DoctorViewInitialValues,
	...UploadViewInitialValues,
	...SummaryViewInitialValues,
	...RequestTypeInitialValues,
};

export type RequestPortalValues = typeof RequestPortalInitialValues;

const stepKeys = ["patient", "records", "doctor", "upload", "summary"];

const steps = [
	<PatientView key="patient" />,
	<RecordsView key="records" />,
	<DoctorView key="doctor" />,
	<UploadView key="upload" />,
	<SummaryView key="summary" />,
];

export interface RequestPortalProps {
	debug?: boolean;
	onShowForms: (data: Boolean) => void;
}

function b64toBlob(b64Data: any, contentType: string, sliceSize?: number) {
	contentType = contentType || "";
	sliceSize = sliceSize || 512;

	const byteCharacters = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: contentType });
	return blob;
}

function postData(
	url: string,
	data: RequestPortalValues & { survey?: String; surveyMessage?: String; upload: { image?: any; document?: any } }
) {
	const formData = new FormData();
	const headers: any = {
		"content-type": "multipart/form-data",
	};
	data.summary.confirmEmail = data.summary.emailSameAsPatient ?
		data.patient.confirmEmail || data.records.patient.confirmEmail
		: data.summary.confirmEmail;
	data.summary.email =
		data.summary.emailSameAsPatient ? data.patient.email || data.records.patient.email
			: data.summary.email;
	data.survey = getUrlWithParams(data.summary.email, "");
	data.surveyMessage = `Please help us improve this site by providing your feedback in a short survey. By doing so, you will be entered to win a ${suveryAmount} gift card.`;

	if (get(data, "upload.image")) {
		const dataImage = get(data, "upload.image");
		let image;
		if (typeof dataImage === "string") {
			const block = dataImage.split(";");
			const contentType = block[0].split(":")[1];
			const realData = block[1].split(",")[1];
			const blob = b64toBlob(realData, contentType);
			image = blob;
		} else {
			image = dataImage;
		}

		formData.append("image", image);
	}
	if (get(data, "upload.document")) {
		Array.from(data.upload.document).forEach((document: any) => formData.append(`document`, document));
	}

	if (get(data, "summary.payment.creditCard.number")) {
		data.summary.payment.creditCard.number = data.summary.payment.creditCard.number.split(' ').join('');
		data.summary.payment.creditCard.number = data.summary.payment.creditCard.number.split('-').join('');
	}

	formData.append("values", new Blob([JSON.stringify(data)], { type: "application/json" }));
	return axios.post(url, formData, headers);
}

export default function RequestPortal(props: RequestPortalProps) {
	const [activeStep, setActiveStep] = React.useState(0);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [formSubmitSucceeded, setFormSubmitSucceded] = React.useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [formSubmitFailed, setFormSubmitFailed] = React.useState(false);
	const [error, setError] = React.useState("");
	const [result, setResult] = React.useState("");
	const portal = usePortal<RequestPortalValues>();
	const formType = useContext(FormContext);
	const { onShowForms } = props;
	const formTitle: string =
		formType.value === "disabilityForms"
			? "Disability Form Submission"
			: "Medical Record Release of Information Form";

	function hasErrors(step: number) {
		const key = stepKeys[step];
		return !portal.validate(key);
	}

	function hasTouched(step: number) {
		const key = stepKeys[step];
		return !!getIn(portal.context.touched, key);
	}

	function checkForError(step: number) {
		return hasTouched(step) && hasErrors(step);
	}

	function handleSubmitFailed(error: any) {
		setIsSubmitting(false);
		setFormSubmitFailed(true);
		setError(error);
	}

	function handleSubmitSucceeded(result: any) {
		setIsSubmitting(false);
		setFormSubmitFailed(false);
		setFormSubmitSucceded(true);
		setResult(result.data);
	}

	function handleSubmit() {
		setIsSubmitting(true);
		postData(`${API_SERVER}/api/portal/submit`, portal.values)
			.then(data => handleSubmitSucceeded(data))
			.catch(error => handleSubmitFailed(error));
	}

	function handleCloseErrorForm() {
		setFormSubmitFailed(false);
	}

	return (
		<React.Fragment>
			<Box p={2}>
				<Typography variant="subtitle1">{formTitle}</Typography>
			</Box>
			<Divider variant="fullWidth" />
			<Box px={2}>
				<Wizard activeStep={activeStep} checkForError={checkForError}>
					{steps}
				</Wizard>
				<Box p={2} display="flex" flexDirection="row" justifyContent="space-between">
					<Box display="flex" flexDirection="row" justifyContent="flex-start">
						<Button
							color="secondary"
							variant="contained"
							onClick={() => {
								if (activeStep === 0) {
									onShowForms(false);
									return;
								}
								setActiveStep(activeStep - 1);
							}}
						//disabled={activeStep <= 0}
						>
							Previous
						</Button>
					</Box>
					<Box display="flex" flexDirection="row" justifyContent="flex-end">
						{activeStep <= 1 ? null : <TotalCost />}
						{activeStep < steps.length - 1 ? (
							<Button
								color="primary"
								variant="contained"
								onClick={() => setActiveStep(activeStep + 1)}
								disabled={!props.debug && hasErrors(activeStep)}
							>
								Next
							</Button>
						) : (
								<Button
									color="primary"
									variant="contained"
									disabled={isSubmitting || hasErrors(activeStep)}
									onClick={handleSubmit}
								>
									Submit
								</Button>
							)}
					</Box>
				</Box>
			</Box>
			<RequestPortalSubmitSuccess open={formSubmitSucceeded} result={result} />
			<RequestPortalSubmitFail open={formSubmitFailed} error={error} handleClose={handleCloseErrorForm} />
		</React.Fragment>
	);
}
