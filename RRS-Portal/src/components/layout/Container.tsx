import React from "react";
import Grid, { GridProps } from "@material-ui/core/Grid";

export interface ContainerProps
	extends Pick<
		GridProps,
		| "alignContent"
		| "alignItems"
		| "classes"
		| "children"
		| "className"
		| "component"
		| "justify"
		| "wrap"
	> {}

export default function Container(props: ContainerProps) {
	return <Grid container direction="row" spacing={2} {...props} />;
}
