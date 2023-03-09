import React from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";

export interface FileUploadButtonProps extends ButtonProps {
	accept?: string;
	capture?: "user" | "environment";
	multiple?: boolean;
	onFileSelect?: (files?: FileList) => void;
}

export default function FileUploadButton(props: FileUploadButtonProps) {
	const { id, accept, capture, multiple, onFileSelect, ...buttonProps } = props;

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		onFileSelect && onFileSelect(e.target.files || undefined);
	}

	return (
		<React.Fragment>
			<input
				type="file"
				id={id}
				accept={accept}
				capture={capture}
				multiple={multiple}
				style={{ display: "none" }}
				onChange={handleChange}
			/>
			<label htmlFor={props.id}>
				<Button {...buttonProps} component="span" />
			</label>
		</React.Fragment>
	);
}
