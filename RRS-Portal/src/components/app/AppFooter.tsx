import React from "react";
import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

const COPYRIGHT = `© 2011-2019 Record Reproduction Services, LLC. All Rights Reserved.`;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		footer: {
			flexShrink: 0,
			width: "100%",
			textAlign: "center",
			padding: 16,
			[theme.breakpoints.down("sm")]: {
				backgroundColor: theme.palette.background.paper,
				fontSize: 10,
			},
		},
	})
);
export default function AppFooter() {
	const classes = useStyles();
	return (
		<footer className={classes.footer}>
			<Typography variant="caption">{COPYRIGHT}</Typography>
		</footer>
	);
}
