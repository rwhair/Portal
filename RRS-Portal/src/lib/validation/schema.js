import * as yup from "yup";
import "./validation";
//import { calculateTotalCost } from "../../lib/calculateTotalCost";
import { PricingTable } from "../PricingTable";

export const DoctorViewValidationSchema = yup.object().shape({
	facility: yup
		.string()
		.where(values => !values.doctor.lastName)
		.required("Required"),
	firstName: yup.string(),
	lastName: yup
		.string()
		.where(values => !values.doctor.facility)
		.required("Required"),
	phoneNumber: yup
		.string()
		.phone()
		.required("Required"),
	fax: yup.string().phone(),
	address: yup.string().required("Required"),
	addressLine2: yup.string(),
	city: yup.string().required("Required"),
	state: yup.string().required("Required"),
	zipCode: yup
		.string()
		.zipCode()
		.required("Required"),
});

export const RequestTypeValidationSchema = yup.object().shape({
	request: yup.object().shape({
		user: yup.object().shape({
			type: yup
				.string()
				.required("Required"),
		}),
		request: yup.object().shape({
			type: yup
				.string()
				.required("Required"),
		})
	})
});

export const PatientViewValidationSchema = yup.object().shape({
	firstName: yup.string().required("Required"),
	lastName: yup.string().required("Required"),
	aka: yup.string(),
	dateOfBirth: yup
		.date()
		.typeError("Invalid date.")
		.required("Required"),
	ssn: yup.string().matches(/([0-9]{4})?/, "Must be 4 digits."),
	email: yup
		.string()
		.email("Invalid email."),
	confirmEmail: yup
		.string()
		.oneOf([yup.ref('email'), null], 'Email must match'),
	phoneNumber: yup
		.string()
		.phone()
		.required("Required"),
});

const recordsViewValidationConfig = {
	recipient: yup.string().required("Required"),
	infoRequested: yup.string().required("Required"),
	specificInfoRequested: yup.string(),
	deliveryMethod: yup.string().required("Required"),
	timeframe: yup.string().required("Required"),
	patient: yup.object().shape({
		fax: yup
			.string()
			.where(
				values => values.records.recipient === "P" && values.records.deliveryMethod === "F"
			)
			.phone()
			.required("Required"),
		confirmFax: yup
			.string()
			.where(
				values => values.records.recipient === "P" && values.records.deliveryMethod === "F"
			)
			.oneOf([yup.ref('fax'), null], 'Fax must match'),
		email: yup
			.string()
			.where(
				values => values.records.recipient === "P" && values.records.deliveryMethod === "E" && !values.patient.email
			)
			.email("Invalid email.")
			.required("Required"),
		confirmEmail: yup
			.string()
			.where(
				values => values.records.recipient === "P" && values.records.deliveryMethod === "E" && !values.patient.confirmEmail
			)
			.oneOf([yup.ref('email'), null], 'Email must match'),
		address: yup
			.string()
			.where(
				values => values.records.recipient === "P" && values.records.deliveryMethod === "M"
			)
			.required("Required"),
		addressLine2: yup.string(),
		city: yup
			.string()
			.where(
				values => values.records.recipient === "P" && values.records.deliveryMethod === "M"
			)
			.required("Required"),
		state: yup
			.string()
			.where(
				values => values.records.recipient === "P" && values.records.deliveryMethod === "M"
			)
			.required("Required"),
		zipCode: yup
			.string()
			.where(
				values => values.records.recipient === "P" && values.records.deliveryMethod === "M"
			)
			.zipCode()
			.required("Required"),
	}),
	doctor: yup.object().shape({
		facility: yup
			.string()
			.where(values => {
				return !values.records.doctor.lastName && values.records.recipient === "D";
			})
			.required("Required"),
		firstName: yup
			.string()
			.where(values => {
				return values.records.recipient === "D";
			}),
		lastName: yup
			.string()
			.where(values => {
				return !values.records.doctor.facility && values.records.recipient === "D";
			})
			.required("Required"),
		fax: yup
			.string()
			.where(
				values => values.records.recipient === "D" && values.records.deliveryMethod === "F"
			)
			.phone()
			.required("Required"),
		confirmFax: yup
			.string()
			.where(
				values => values.records.recipient === "D" && values.records.deliveryMethod === "F"
			)
			.oneOf([yup.ref('fax'), null], 'Fax must match'),
		email: yup
			.string()
			.where(
				values => values.records.recipient === "D" && values.records.deliveryMethod === "E"
			)
			.email("Invalid email.")
			.required("Required"),
		confirmEmail: yup
			.string()
			.where(
				values => values.records.recipient === "D" && values.records.deliveryMethod === "E"
			)
			.oneOf([yup.ref('email'), null], 'Email must match'),
		address: yup
			.string()
			.where(
				values => values.records.recipient === "D" && values.records.deliveryMethod === "M"
			)
			.required("Required"),
		addressLine2: yup.string(),
		city: yup
			.string()
			.where(
				values => values.records.recipient === "D" && values.records.deliveryMethod === "M"
			)
			.required("Required"),
		state: yup
			.string()
			.where(
				values => values.records.recipient === "D" && values.records.deliveryMethod === "M"
			)
			.required("Required"),
		zipCode: yup
			.string()
			.where(
				values => values.records.recipient === "D" && values.records.deliveryMethod === "M"
			)
			.zipCode()
			.required("Required"),
	}),
	thirdParty: yup.object().shape({
		company: yup
			.string()
			.where(values => {
				return !values.records.thirdParty.lastName && values.records.recipient === "T"
			})
			.required("Required"),
		firstName: yup
			.string()
			.where(values => values.records.recipient === "T"),
		lastName: yup
			.string()
			.where(values => {
				return !values.records.thirdParty.company && values.records.recipient === "T"
			})
			.required("Required"),
		fax: yup
			.string()
			.where(
				values => values.records.recipient === "T" && values.records.deliveryMethod === "F"
			)
			.phone()
			.required("Required"),
		confirmFax: yup
			.string()
			.where(
				values => values.records.recipient === "T" && values.records.deliveryMethod === "F"
			)
			.oneOf([yup.ref('fax'), null], 'Fax must match'),
		email: yup
			.string()
			.where(
				values => values.records.recipient === "T" && values.records.deliveryMethod === "E"
			)
			.email("Invalid email.")
			.required("Required"),
		confirmEmail: yup
			.string()
			.where(
				values => values.records.recipient === "T" && values.records.deliveryMethod === "E"
			)
			.oneOf([yup.ref('email'), null], 'Email must match'),
		address: yup
			.string()
			.where(
				values => values.records.recipient === "T" && values.records.deliveryMethod === "M"
			)
			.required("Required"),
		addressLine2: yup.string(),
		city: yup
			.string()
			.where(
				values => values.records.recipient === "T" && values.records.deliveryMethod === "M"
			)
			.required("Required"),
		state: yup
			.string()
			.where(
				values => values.records.recipient === "T" && values.records.deliveryMethod === "M"
			)
			.required("Required"),
		zipCode: yup
			.string()
			.where(
				values => values.records.recipient === "T" && values.records.deliveryMethod === "M"
			)
			.zipCode()
			.required("Required"),
	}),
};

export const RecordsViewValidationSchema = yup.object().shape({
	...recordsViewValidationConfig,
	startDate: yup
		.date()
		.typeError("Invalid date.")
		.required("Required"),
	endDate: yup
		.date()
		.typeError("Invalid date.")
		.min(yup.ref("startDate"), "End date can't be before start date.")
		.required("Required"),
	reasonForRelease: yup.string().required("Required"),
});

export const RecordsDisabilityViewValidationSchema = yup.object().shape(recordsViewValidationConfig);

export const SummaryViewValidationSchema = yup.object().shape({
	email: yup
		.string()
		.where(
			values => !values.summary.emailSameAsPatient
		)
		.email("Invalid email.")
		.required("Required"),
	confirmEmail: yup
		.string()
		.where(
			values => !values.summary.emailSameAsPatient
		)
		.oneOf([yup.ref('email'), null], 'Email must match'),
	emailSameAsPatient: yup.boolean(),
	signature: yup.string()
		.required("Required"),
	token: yup.string()
		.required("Required"),
	acknowledge: yup.bool().oneOf([true], 'Field must be checked'),
	payment: yup.object().shape({
		type: yup
			.string()
			.where(values => PricingTable.get().getTotalCost(
				values.records.recipient,
				values.records.infoRequested,
				values.records.deliveryMethod,
				values.records.DeliveryTimeframe))
			.required("Required"),
		creditCard: yup.object().shape({
			number: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.creditCardNumber()
				.required("Required"),
			name: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.required("Required"),
			expDate: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.creditCardExpDate()
				.required("Required"),
			securityCode: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.required("Required"),
			firstName: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.required("Required"),
			lastName: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.required("Required"),
			address: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.required("Required"),
			addressLine2: yup.string(),
			city: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.required("Required"),
			state: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.required("Required"),
			zipCode: yup
				.string()
				.where(values => values.summary.payment.type === "C")
				.zipCode()
				.required("Required"),
		}),
		bankTransfer: yup.object().shape({
			accountType: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			accountName: yup.string(),
			routingNumber: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			accountNumber: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			bankName: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			checkNumber: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			amount: yup
				.string()
				//.where(values => values.summary.payment.type === "B")
				.required("Required"),
			firstName: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			lastName: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			address: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			addressLine2: yup.string(),
			city: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			state: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.required("Required"),
			zipCode: yup
				.string()
				.where(values => values.summary.payment.type === "B")
				.zipCode()
				.required("Required"),
		}),
	}),
});

export const UploadViewValidationSchema = yup.object().shape({
	nofile: yup.boolean(),
	image: yup.mixed()
		.when('nofile', {
			is: false,
			then: yup.mixed()
				.test({
					name: 'file',
					exclusive: true,
					message: 'Photo required',
					test: value => (value && !value.name) || (value && value.name && value.name !== 'placeholder.png'),
				})
				.required('Required')
		}),
	ssn: yup.string().matches(/([0-9]{4})?/, "Must be 4 digits.")
		.when('nofile', {
			is: true,
			then: yup.string()
				.where(values => !values.patient.id)
				.required('Required'),
		}),
	id: yup.string()
		.when('nofile', {
			is: true,
			then: yup.string()
				.where(values => !values.patient.ssn)
				.required('Required'),
		}),
});

export const RequestPortalValidationSchema = (formType) => yup.object().shape({
	patient: PatientViewValidationSchema,
	records: formType === 'disabilityForms' ? RecordsDisabilityViewValidationSchema : RecordsViewValidationSchema,
	//disabiltyRecords: RecordsDisabilityViewValidationSchema,
	doctor: DoctorViewValidationSchema,
	upload: UploadViewValidationSchema,
	summary: SummaryViewValidationSchema,
	request: RequestTypeValidationSchema,
});
