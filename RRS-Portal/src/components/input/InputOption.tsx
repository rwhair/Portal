import React from "react";

export default interface InputOption<T = string> {
	label?: React.ReactNode;
	value?: T;
}
