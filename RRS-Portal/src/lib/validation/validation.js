import * as yup from "yup";
import * as moment from "moment";
import valid from "card-validator";

const rePhone = /^\([2-9][0-9]{2}\) [2-9][0-9]{2}-[0-9]{4}$/;

yup.addMethod(yup.string, "phone", function() {
	return this.test("phone", "Invalid phone/fax number.", value => {
		return value ? rePhone.test(value) : true;
	});
});

yup.addMethod(yup.date, "format", function(formats) {
	return this.transform(function(value, originalValue) {
		if (this.isType(value)) return value;
		value = moment(originalValue, formats);
		return value.isValid() ? value.toDate() : new Date("");
	});
});

const reZipCode = /^[0-9]{5}/;

yup.addMethod(yup.string, "zipCode", function() {
	return this.test("zipCode", "Invalid ZIP Code.", value => {
		return value ? reZipCode.test(value) : true;
	});
});

yup.addMethod(yup.string, "where", function(callback) {
	return this.when("$values", (values, schema) => (callback(values) ? schema : yup.string()));
});

yup.addMethod(yup.string, "creditCardNumber", function() {
	return this.test(
		"creditCardNumber",
		"Invalid credit card number.",
		value => valid.number(value).isValid
	);
});

yup.addMethod(yup.string, "creditCardExpDate", function() {
	return this.test(
		"creditCardExpDate",
		"Invalid expiration date.",
		value => valid.expirationDate(value).isValid
	);
});
