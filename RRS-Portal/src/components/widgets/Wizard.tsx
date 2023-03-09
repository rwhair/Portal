import React from "react";
import { Stepper, Step, StepLabel } from "@material-ui/core";

export interface WizardProps {
	activeStep?: number;
	children?: React.ReactNode;
	checkForError?: (step: number) => boolean;
}

export default function Wizard(props: WizardProps) {
	const children = React.Children.toArray(props.children);
	const activeStep = props.activeStep || 0;
	const checkForError = props.checkForError || (i => false);

	if (activeStep < 0 || activeStep > children.length - 1) {
		console.log(
			"Wizard has activeStep " + activeStep + " but only " + children.length + " children!"
		);
		return null;
	}

	return (
		<React.Fragment>
			<Stepper activeStep={activeStep}>
				{children.map((_, i) => (
					<Step key={i}>
						<StepLabel error={activeStep !== i && checkForError(i)}>&nbsp;</StepLabel>
					</Step>
				))}
			</Stepper>
			{children[activeStep]}
		</React.Fragment>
	);
}
