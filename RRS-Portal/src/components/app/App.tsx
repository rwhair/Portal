import React, { useState } from "react";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import FormContext from '../../context/formTypeContext';

import AppBody from "./AppBody";
import createAppTheme from "./createAppTheme";

export default function App() {
	const [formType, setFormType] = useState<string>('');
	const theme = createAppTheme();

	return (
		<ThemeProvider theme={theme}>
			<FormContext.Provider
				value={{
					value: formType,
					setFormType
				}}
			>
				<CssBaseline />
				<AppBody />
			</FormContext.Provider>
		</ThemeProvider>
	);
}
