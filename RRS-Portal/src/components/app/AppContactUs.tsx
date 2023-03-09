import React from "react";
import {
	makeStyles,
	Theme,
	createStyles,
	Dialog,
	DialogTitle,
	IconButton,
	DialogContent,
	Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

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

export interface AppContactUsProps {
	open?: boolean;
	handleClose?: () => void;
}

export default function AppContactUs(props: AppContactUsProps) {
	const classes = useStyles();
	return (
		<Dialog onClose={props.handleClose} open={!!props.open} className={classes.root}>
			<DialogTitle disableTypography>
				<Typography variant="h6">Contact Us</Typography>
			</DialogTitle>
			{!props.handleClose ? null : (
				<IconButton
					aria-label="Close"
					className={classes.closeButton}
					onClick={props.handleClose}
				>
					<CloseIcon />
				</IconButton>
			)}
			<DialogContent>
				<Typography variant="body1" color="textPrimary" paragraph>
					For technical support or assistance completing this form, please contact RRS at:
				</Typography>
				<Typography variant="body1" color="textPrimary">
					<span style={{ fontWeight: 800 }}>Tel: </span> 484.468.1299
				</Typography>
				<Typography variant="body1" color="textPrimary" paragraph>
					<span style={{ fontWeight: 800 }}>Email: </span>{" "}
					<a href="mailto:support@rrsmedical.com">support@rrsmedical.com</a>
				</Typography>
			</DialogContent>
		</Dialog>
	);
}
