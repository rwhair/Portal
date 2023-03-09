import React, { useContext } from "react";
import { createStyles, makeStyles, Paper, Theme, FormControlLabel, Checkbox, Box } from "@material-ui/core";
import Portal from "../portal/Portal";
import RequestPortal, { RequestPortalInitialValues } from "../portal/RequestPortal";
import RequestTypeView from "../views/RequestTypeView";
import { RequestPortalValidationSchema } from "../../lib/validation/schema";
import FormContext from "../../context/formTypeContext";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		main: {
			flex: "1 0 auto",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "flex-start",
		},
		paper: {
			margin: "0 auto",
			width: "90%",
			maxWidth: "900px",
			marginBottom: 40,
			[theme.breakpoints.down("sm")]: {
				width: "100%",
				height: "100%",
				border: "none",
				boxShadow: "none",
				marginBottom: 0,
			},
		},
	})
);

export default function AppMain() {
	const [debug, setDebug] = React.useState(false);
	const [showForms, setShowForms] = React.useState<Boolean>(false);
	const formType = useContext(FormContext);
	const validationSchema = RequestPortalValidationSchema(formType.value);

	function handleChangeDebug(e: React.ChangeEvent<HTMLInputElement>) {
		setDebug(e.target.checked);
	}

	const classes = useStyles();
	return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<Portal initialValues={RequestPortalInitialValues} validationSchema={validationSchema}>
					{!showForms ? (
						<RequestTypeView onShowForms={setShowForms} />
					) : (
						<RequestPortal onShowForms={setShowForms} debug={debug} />
					)}
				</Portal>
			</Paper>
			{/*<Box p={2}>
				<FormControlLabel
					control={
						<Checkbox
							icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
							checkedIcon={<CheckBoxIcon fontSize="small" />}
							value={debug}
							onChange={handleChangeDebug}
							color="primary"
						/>
					}
					label="Debug Mode (disable validation)"
				/>
			</Box>*/}
		</main>
	);
}
