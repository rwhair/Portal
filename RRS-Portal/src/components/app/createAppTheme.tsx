import createMuiTheme, { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import "./assets/fonts/sofia-pro.css";

const colors = {
	white: "#ffffff",
	black: "#000000",
	darkKhaki: "#998a5c",
	dark: "#181f25",
	almostBlack: "#0d1114",
	navy: "#041b2b",
	slateGrey: "#666970",
	marineBlue: "#003a65",
	greenishCyan: "#50e3c2",
	lightishBlue: "#3f7af2",
	tomato: "#e74621",
	mango: "#ffae28",
	iceBlue: "#f2f5f6",
	lightPeriwinkle: "#d8dee6",
	duckEggBlue: "#d9e1e3",
};

type Colors = typeof colors;

// Inject our custom colors into the theme interface so we can access
// them when styling components.
declare module "@material-ui/core/colors/common" {
	export interface CommonColors extends Colors {}
}

const theme: ThemeOptions = {
	shape: {
		borderRadius: 2,
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1800,
		},
	},
	palette: {
		common: {
			...colors,
		},
		primary: {
			main: colors.lightishBlue,
		},
		secondary: {
			main: colors.lightPeriwinkle,
		},
		error: {
			main: colors.tomato,
		},
		text: {
			primary: colors.navy,
			secondary: colors.slateGrey,
		},
		divider: colors.duckEggBlue,
		background: {
			default: colors.iceBlue,
			paper: colors.white,
		},
	},
	spacing: 8,
	typography: {
		fontFamily: "SofiaPro",
		fontSize: 16,
		fontWeightLight: 300,
		fontWeightRegular: 500,
		fontWeightMedium: 500,
		h3: {
			fontSize: 30,
			fontWeight: 800,
		},
		h6: {
			fontSize: 16,
			fontWeight: 800,
			lineHeight: 0.94,
		},
		subtitle1: {
			fontSize: 24,
			fontWeight: 500,
		},
		subtitle2: {
			fontSize: 20,
			fontWeight: 500,
		},
		body1: {
			fontSize: 14,
			fontWeight: 500,
			lineHeight: 1.21,
		},
		body2: {
			fontSize: 12,
			fontWeight: 500,
			lineHeight: 1.25,
		},
		button: {
			fontSize: 16,
			fontWeight: 500,
			letterSpacing: 0.4,
			textTransform: "none",
		},
		caption: {
			fontSize: 12,
			lineHeight: 1.25,
			color: "textSecondary",
		},
		overline: {
			fontSize: 12,
			fontWeight: 800,
			lineHeight: 1.25,
			textTransform: "uppercase",
		},
	},
	overrides: {
		MuiButton: {
			contained: {
				color: colors.white,
				backgroundColor: colors.dark,
				"&:hover": {
					backgroundColor: colors.slateGrey,
					"@media (hover: none)": {
						backgroundColor: colors.dark,
					},
				},
			},
		},
		MuiMenuItem: {
			root: {
				color: colors.slateGrey,
				fontSize: 16,
				fontWeight: 500,
				letterSpacing: 0.4,
				textTransform: "none",
			},
		},
	},
};

export default function createAppTheme() {
	return createMuiTheme(theme);
}
