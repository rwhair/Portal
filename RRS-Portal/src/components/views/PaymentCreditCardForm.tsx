import React from "react";
import Item from "../layout/Item";
import { Typography } from "@material-ui/core";
import TextInput from "../input/TextInput";
import SelectInput from "../input/SelectInput";
import ZipCodeInput from "../input/ZipCodeInput";
import states from "./assets/states.json";

export default function PaymentCreditCardForm() {
	return (
		<React.Fragment>
			<Item>
				<Typography variant="overline">Card Information</Typography>
			</Item>
			<TextInput
				name="summary.payment.creditCard.number"
				label="Credit Card Number"
				required
			/>
			<TextInput
				sm={6}
				name="summary.payment.creditCard.name"
				label="Cardholder's Name"
				required
			/>
			<TextInput
				xs={6}
				sm={3}
				name="summary.payment.creditCard.expDate"
				label="Expiration Date (MM/YY)"
				required
			/>
			<TextInput
				xs={6}
				sm={3}
				name="summary.payment.creditCard.securityCode"
				label="Security Code"
				required
			/>
			<Item>
				<Typography variant="overline">Billing Address</Typography>
			</Item>
			<TextInput
				sm={6}
				name="summary.payment.creditCard.firstName"
				label="First Name"
				required
			/>
			<TextInput
				sm={6}
				name="summary.payment.creditCard.lastName"
				label="Last Name"
				required
			/>
			<TextInput sm={6} name="summary.payment.creditCard.address" label="Address" required />
			<TextInput
				sm={6}
				name="summary.payment.creditCard.addressLine2"
				label="Address Line 2"
			/>
			<TextInput sm={6} name="summary.payment.creditCard.city" label="City" required />
			<SelectInput
				xs={6}
				sm={3}
				name="summary.payment.creditCard.state"
				label="State"
				options={states}
				required
			/>
			<ZipCodeInput
				xs={6}
				sm={3}
				name="summary.payment.creditCard.zipCode"
				label="ZIP Code"
				required
			/>
		</React.Fragment>
	);
}
