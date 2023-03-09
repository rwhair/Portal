import React from "react";
import Item from "../layout/Item";
import { Typography } from "@material-ui/core";
import TextInput from "../input/TextInput";
import SelectInput from "../input/SelectInput";
import ZipCodeInput from "../input/ZipCodeInput";
import states from "./assets/states.json";

export default function PaymentBankAccount() {
	return (
		<React.Fragment>
			<Item>
				<Typography variant="overline">Account Information</Typography>
			</Item>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.accountType"
				label="Account Type"
				required
			/>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.accountName"
				label="Account Name"
			/>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.routingNumber"
				label="Routing Number"
				required
			/>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.accountNumber"
				label="Account Number"
				required
			/>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.bankName"
				label="Bank Name"
				required
			/>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.checkNumber"
				label="Check Number"
				required
			/>
			{
				// <TextInput sm={6} name="summary.payment.bankTransfer.amount" label="Amount" required />
			}
			<Item>
				<Typography variant="overline">Account Holder's Address</Typography>
			</Item>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.firstName"
				label="First Name"
				required
			/>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.lastName"
				label="Last Name"
				required
			/>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.address"
				label="Address"
				required
			/>
			<TextInput
				sm={6}
				name="summary.payment.bankTransfer.addressLine2"
				label="Address Line 2"
			/>
			<TextInput sm={6} name="summary.payment.bankTransfer.city" label="City" required />
			<SelectInput
				xs={6}
				sm={3}
				name="summary.payment.bankTransfer.state"
				label="State"
				options={states}
				required
			/>
			<ZipCodeInput
				xs={6}
				sm={3}
				name="summary.payment.bankTransfer.zipCode"
				label="ZIP Code"
				required
			/>
		</React.Fragment>
	);
}
