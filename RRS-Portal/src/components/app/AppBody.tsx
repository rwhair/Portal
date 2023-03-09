import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import AppHeader from "./AppHeader";
import AppMain from "./AppMain";
import AppFooter from "./AppFooter";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "stretch",
			justifyContent: "stretch",
			backgroundColor: theme.palette.background.default,
		},
	})
);

export default function AppBody() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<AppHeader />
			<AppMain />
			<AppFooter />
		</div>
	);
}
