import React, { useState, useContext } from "react";
import Box from "@material-ui/core/Box";
import { createStyles, makeStyles } from "@material-ui/styles";
import { Theme, Typography, Button, Divider, Grid } from "@material-ui/core";
import Container from "../layout/Container";
import Item from "../layout/Item";
import medicalRecords from "./assets/medical-records.svg";
import disabilityForms from "./assets/disability.svg";
import { usePortal } from "../portal/Portal";
import FormContext from "../../context/formTypeContext";

export type RequestViewValues = {
	request: {
		user: {
			type: string;
		};
		request: {
			type: string;
		};
	};
};

export const RequestTypeInitialValues = {
	request: {
		user: {
			type: "patient",
		},
		request: {
			type: "patient",
		},
	},
};

type PropsType = {
	onShowForms: Function;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			display: "block",
			width: "100%",
			height: "100%",
		},
		content: {
			width: "100%",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "space-between",
			padding: theme.spacing(1),
			textAlign: "center",
		},
		ieHack: {
			width: "100%",
		},
		image: {
			display: "block",
			marginBottom: theme.spacing(1),
		},
		divider: {
			width: "100%",
		},
		standardPadding: {
			padding: "7px 35px 0 35px",
		},
		leftButton: {
			padding: "10px 13px 0 35px;",
			"& button": {
				boxShadow: "none !important",
			},
			[theme.breakpoints.down("xs")]: {
				padding: "10px 35px 0 35px;",
			},
		},
		rightButton: {
			padding: "10px 35px 0 13px;",
			"& button": {
				boxShadow: "none !important",
			},
			[theme.breakpoints.down("xs")]: {
				padding: "10px 35px 0 35px;",
			},
		},
		bottomPadding: {
			padding: "25px 35px 40px 35px;",
		},
		recaptcha: {
			margin: "20px 0 0 35px",
		},
	})
);

interface IFormContext {
	value: string;
	setFormType: Function;
}

export default function RequestTypeView(props: PropsType) {
	const { onShowForms } = props;
	const formTypeContext: IFormContext = useContext(FormContext);
	const form = usePortal<RequestViewValues>();
	const classes = useStyles();

	return (
		<Box pt={1}>
			<Container>
				<Grid className={classes.standardPadding}>
					<Typography variant="subtitle1">I would like to request my:</Typography>
				</Grid>
				<Item>
					<Divider className={classes.divider} variant="fullWidth" />
				</Item>
				<Grid className={classes.rightButton} sm={3}></Grid>
				<Grid className={classes.leftButton} sm={6}>
					<Button
						className={classes.button}
						variant="contained"
						color="secondary"
						onClick={() => {
							formTypeContext.setFormType("medicalRecords");
							form.context.setFieldValue("request.request.type", "medicalRecords");
							onShowForms(true);
						}}
					>
						<div className={classes.content}>
							<img className={classes.image} src={medicalRecords} alt="Medical Records" />
							<Typography variant="h3" paragraph className={classes.ieHack}>
								Medical Records
							</Typography>
							<Typography variant="body1" paragraph className={classes.ieHack}>
								{form.values.request.user.type === "patient"
									? `Please be prepared with your driver's license or another form of photo ID before starting this form.`
									: `Please be prepared with a completed HIPAA authorization, in PDF or Word format, signed by the patient before starting this form.`}
							</Typography>
							<Typography variant="body2" color="textSecondary" paragraph className={classes.ieHack}>
								{form.values.request.user.type === "patient"
									? ` You will be asked to upload it along with a selfie before submission.`
									: ` You will be asked to upload it before submission.`}
							</Typography>
						</div>
					</Button>
				</Grid>
				<Grid className={classes.rightButton} sm={3}></Grid>
				<Grid className={classes.bottomPadding}>
					<Typography variant="caption" color="textPrimary">
						Shipping charges will be incurred for any documents or materials sent in paper format or in an
						expedited manner.
					</Typography>
				</Grid>
			</Container>
		</Box>
	);
}
