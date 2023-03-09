const sslRedirect = require("heroku-ssl-redirect");
const nodemailer = require("nodemailer");
const express = require("express");
const path = require("path");
const PDFDocument = require("pdfkit");

const BCC_USER = "rhair@rrsmedical.com";

/*const transporter = nodemailer.createTransport({
	pool: true,
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: false,
	requireTLS: true,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
	//tls: {
	//	ciphers: "SSLv3",
	//},
});

transporter.verify((error, success) => {
	if (error) {
		console.log(`Error verifying SMTP configuration: ${error}`);
		process.exit(-1);
	} else {
		console.log(`SMTP configuration verified.`);
	}
});*/

function generateId() {
	const length = 12;
	const chars = "2456789ABCDFGHJKLMNPQRSTUVWXYZ";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result.substring(0, 4) + "-" + result.substring(4, 8) + "-" + result.substring(8, 12);
}

function getInfoRequested(values) {
	switch (values.records.infoRequested || "R") {
		case "R":
			return "records";
		case "F":
			return "films";
		case "B":
			return "bills";
		case "RF":
			return "records and films";
		case "RFB":
			return "records, films, and bills";
		case "D":
			return "disability forms";
		default:
			return "records";
	}
}

function getDestination(values) {
	switch (values.records.recipient || "P") {
		case "P":
			return "you";
		case "D":
			return values.records.doctor.facility || "your doctor";
		case "T":
			return values.records.thirdParty.company || "a third party";
		default:
			return "your chosen recipient";
	}
}

function getShippingMethod(data) {
	switch (data.records.deliveryMethod || "E") {
		case "E":
			return "email";
		case "F":
			return "fax";
		case "M":
			return "mail";
		default:
			return "email";
	}
}

function getDeliveryTimeframe(data) {
	switch (data.records.timeframe || "S") {
		case "F":
			return "1 day";
		case "M":
			return "2-5 days";
		case "S":
			return "5-7 days";
		default:
			return "7 days";
	}
}

function createPDF(data, id) {}

function sendConfirmationEmail(data, id) {
	const message = {
		from: process.env.SMTP_USER,
		to: data.summary.email,
		bcc: BCC_USER,
		subject: `Records Request Confirmation`,
		html: `
<p>
Thank you for allowing RRS to fulfill your request for records. Your order ${id} for ${getInfoRequested(
			data
		)} to be sent to ${getDestination(data)} via ${getShippingMethod(
			data
		)} has been received and is being processed by our highly trained team at RRS. Your records will be available within ${getDeliveryTimeframe(
			data
		)}.
</p>
<p>
Our Customer Service team is available to provide real-time support throughout the entire process.
</p>
<p>
If you have any questions regarding your order, please contact RRS at status@rrsmedical.com, or you may call us at 484-468-1299.
</p>
<p>
Thank you,<br/>
RRS Service Team
</p>
`,
	};

	/*transporter.sendMail(message, (err, info) => {
		if (err != null) {
			console.log(`Error sending email to ${message.to}: ${err}`);
		} else {
			console.log(`Mail successfully sent to ${message.to}.`);
		}
		console.log(`Details: `);
		console.log(info);
	});*/
}

function handleSubmit(req, res) {
	const id = generateId();
	sendConfirmationEmail(req.body, id);
	res.send({ status: "success", requestId: id });
}

const PORT = process.env.PORT || 5000;

const app = express();
app.use(sslRedirect());
app.use(express.json());

app.post("/api/submit", (req, res) => handleSubmit(req, res));

app.use(express.static(path.join(__dirname, "build")));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
