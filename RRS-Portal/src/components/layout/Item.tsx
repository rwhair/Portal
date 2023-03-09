import React from "react";
import Grid, { GridProps } from "@material-ui/core/Grid";

export interface ItemProps extends Pick<GridProps, "xs" | "sm" | "md" | "lg" | "xl" | "children"> {}

export function getItemProps<T extends ItemProps>(props: T): [ItemProps, Omit<T, keyof ItemProps>] {
	const { xs, sm, md, lg, xl, children, ...otherProps } = props;
	return [{ xs, sm, md, lg, xl, children }, otherProps];
}

export default function Item(props: ItemProps) {
	return <Grid item {...props} xs={props.xs || 12} />;
}
