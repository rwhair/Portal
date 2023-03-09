import React from "react";
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import rrsLogo from "./assets/rrs-logo-reverse.png";
import AppContactUs from "./AppContactUs";
import { url as surveyUrl } from '../../lib/surveyUrl';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		header: {
			flexShrink: 0,
			position: "relative",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			backgroundColor: "#003a65",
			padding: "12px 24px",
			marginBottom: 80,
			[theme.breakpoints.down("sm")]: {
				marginBottom: 0,
			},
			[theme.breakpoints.down("xs")]: {
				flexDirection: "column",
			},
		},
		rrsLogo: {
			marginLeft: 'calc(50% - 50px)',
			width: '100px',
			[theme.breakpoints.down("xs")]: {
				margin: "0 auto 12px auto",
			},
		},
		surveyLink: {
			textDecoration: 'none',
			marginRight: 10
		}
	})
);

export default function AppHeader() {
	const classes = useStyles();
	const [showContactUs, setShowContactUs] = React.useState(false);

	function openContactUs() {
		setShowContactUs(true);
	}

	function closeContactUs() {
		setShowContactUs(false);
	}

	return (
		<React.Fragment>
			<header className={classes.header}>
				<img className={classes.rrsLogo} src={rrsLogo} alt="Record Reproduction Services" />
				<div>
					<a className={classes.surveyLink} href={surveyUrl} target={'_blank'}>
						<Button color="default" variant="contained">Survey</Button>
					</a>
					<Button color="default" variant="contained" onClick={openContactUs}>
						Contact Us
					</Button>
				</div>
			</header>
			<AppContactUs open={showContactUs} handleClose={closeContactUs} />
		</React.Fragment>
	);
}