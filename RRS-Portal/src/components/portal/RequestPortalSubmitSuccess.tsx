import React from "react";
import {
	makeStyles,
	Theme,
	createStyles,
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	Box,
	Button,
} from "@material-ui/core";
import { usePortal } from "./Portal";
import { RequestPortalValues } from "./RequestPortal";
import { getUrlWithParams, suveryAmount } from '../../lib/surveyUrl';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			margin: 0,
			padding: theme.spacing(1),
			paddingBottom: theme.spacing(2),
		},
		closeButton: {
			position: "absolute",
			right: theme.spacing(1),
			top: theme.spacing(1),
			color: theme.palette.grey[500],
		},
	})
);

export interface RequestPortalSubmitSuccessProps {
	open?: boolean;
	result?: any;
}

function handleReload() {
	window.location.reload();
}

export default function RequestPortalSubmitSuccess(props: RequestPortalSubmitSuccessProps) {
	const classes = useStyles();
	const portal = usePortal<RequestPortalValues>();
	const { values: { patient: { email }, summary: { emailSameAsPatient } } } = portal;
	const whereToSendEmail = emailSameAsPatient && email ? email : portal.values.summary.email;

	return (
		<Dialog
			open={!!props.open}
			className={classes.root}
			disableBackdropClick={true}
			disableEscapeKeyDown={true}
		>
			<DialogTitle disableTypography>
				<Typography variant="h6">Your request has been submitted.</Typography>
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1" color="textPrimary" paragraph>
					Thank you for ordering with RRS.
				</Typography>
				<Typography variant="body1" color="textPrimary" paragraph>
					We have received your request, and a confirmation email has been sent to{" "}
					{ whereToSendEmail }
				</Typography>
				<Typography variant="body1" color="textPrimary" paragraph>
					Please help us improve this site by providing your feedback in a short <a href={getUrlWithParams(whereToSendEmail, props && props.result && props.result.requestId)} target={'_blank'}>survey</a>.
					By doing so, you will be entered to win a { suveryAmount } gift card.
				</Typography>
				<Typography variant="body1" color="textPrimary" paragraph>
					You can close this browser window, or click the button below to submit another
					request.
				</Typography>
				<Box display="flex" flexDirection="row" justifyContent="center">
					<Button variant="contained" color="primary" onClick={handleReload}>
						Submit Another Request
					</Button>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
