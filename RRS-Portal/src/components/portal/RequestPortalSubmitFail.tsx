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

export interface RequestPortalSubmitFailProps {
	open?: boolean;
	error?: any;
	handleClose?: any;
}

export default function RequestPortalSubmitFail(props: RequestPortalSubmitFailProps) {
	const classes = useStyles();
	const errorMessage = props.error && props.error.response && props.error.response.data && props.error.response.data.error;

	return (
		<Dialog
			open={!!props.open}
			className={classes.root}
			disableBackdropClick={true}
			disableEscapeKeyDown={true}
		>
			<DialogTitle disableTypography>
				<Typography variant="h6">Something went wrong while submitting your request.</Typography>
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1" color="textPrimary" paragraph>
					We're sorry, but something went wrong while submitting your request.
				</Typography>
				<Typography variant="body1" color="textPrimary" paragraph>
					Please wait a few minutes and try the Submit button again, or contact us for technical assistance at:
				</Typography>
				<Typography variant="body1" color="textPrimary" paragraph>
					Tel: 484.468.1299 Email: support@rrsmedical.com
				</Typography>
				<Typography variant="body1" color="textPrimary" paragraph>
					Error: {errorMessage || "Unknown"}
				</Typography>
				<Box display="flex" flexDirection="row" justifyContent="center">
					<Button variant="contained" color="primary" onClick={props.handleClose}>
						Close
					</Button>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
