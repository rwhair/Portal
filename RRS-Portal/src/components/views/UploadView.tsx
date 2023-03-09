import {Box, Button, IconButton, Modal, Theme, Typography} from "@material-ui/core";
import DeleteForever from "@material-ui/icons/DeleteForever";
import React, { useEffect } from "react";
import Container from "../layout/Container";
import Item from "../layout/Item";
import FileUploadButton from "../widgets/FileUploadButton";
import VideoCapture from "../widgets/VideoCapture";
import { usePortal } from "../portal/Portal";
import CheckboxInput from "../input/CheckboxInput";
import TextInput from "../input/TextInput";
import Grid from "@material-ui/core/Grid";
import {RequestPortalValues} from "../portal/RequestPortal";

export const UploadViewInitialValues = { upload: {
		image: null,
		document: null,
		nofile: false,
	} };


export type UploadViewValues = {
	upload: {
		image: File | null,
		document: File | null,
		nofile: boolean,
	}
};

const dataURLtoFile = (dataurl : any, filename : string) => {
	try {
		const arr = dataurl.split(',');

		if(arr.length) {
			const mime : string = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]);
			let n = bstr.length, u8arr = new Uint8Array(n);
			while(n--){
				u8arr[n] = bstr.charCodeAt(n);
			}

			if(/Edge/.test(navigator.userAgent)){
				const blob : Blob & { name?: string } = new Blob([u8arr], {type:mime});
				blob.name = filename;
				return blob;
			}
			return new File([u8arr], filename, {type:mime});
		}
	}
	catch(e){
		console.log("error", e);
	}
};

export default function UploadView() {
	const portal = usePortal<RequestPortalValues>();
	const canvas = document.createElement('canvas');
	const dataURL = canvas.toDataURL("image/png");
	const file = dataURLtoFile(dataURL, 'placeholder.png');

	const form = usePortal<UploadViewValues>();
	const [photoImageURL, setPhotoImageURL] = React.useState<any>('');
	const [photoImageFile, setPhotoImageFile] = React.useState<File | null>(null);
	const [videoCaptureOpen, setVideoCaptureOpen] = React.useState(false);
	const [documentList, setDocumentList] = React.useState<File[]>([]);

	useEffect(() => {
		form.context.setFieldValue('upload.image', file);
		return () => {};
	}, []);

	function handleVideoCapture(src: string) {
		setVideoCaptureOpen(false);
		setPhotoImageURL(src);
		form.context.setFieldValue('upload.image', src);
	}

	function handleVideoCaptureCancel() {
		setVideoCaptureOpen(false);
	}

	function handleVideoCaptureError(err: string) {
		setVideoCaptureOpen(false);
		alert(err);
	}

	function handlePhotoSelect(files?: FileList) {
		if (files && files.length > 0 && files[0]) {
			const reader = new FileReader();

			reader.addEventListener("load", function () {
				setPhotoImageURL(reader.result);
			}, false);

			if (files[0]) {
				reader.readAsDataURL(files[0]);
			}

			form.context.setFieldValue('upload.image', files[0]);
			setPhotoImageFile(files[0]);
		}
	};

	function handleDocumentUpload(files?: any) {
		if (files && files.length > 0 && files[0]) {
			setDocumentList([...documentList, ...files]);
			form.context.setFieldValue('upload.document', files);
		}
	}

	function handleDocumentRemove(file: File) {
		if (file && documentList.includes(file)) {
			setDocumentList((documentList: File[]) =>
				documentList.filter((doc: File) => doc !== file)
			);
		}
	}

	return (
		<Container>
			<Item>
				<Typography variant="subtitle2">Verify Your Identity</Typography>
				<Typography variant="body1" color="textSecondary">
					Please verify your identity by adding a photo of yourself holding your driver's
					license or other government-issued photo ID.
				</Typography>
			</Item>
			<Item>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="flex-start"
				>
					<Box
						p="1px"
						minWidth={320}
						maxWidth={320}
						minHeight={240}
						border="2px dashed #9399a7"
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						textAlign="center"
					>
						{photoImageURL === "" ? (
							<Typography variant="button" color="textSecondary">
								Photo ID
							</Typography>
						) : (
							<img
								id="photo-id"
								src={photoImageURL}
								alt="Identity Verification"
								style={{ maxWidth: "90%" }}
							/>
						)}
					</Box>
					<Box
						p={2}
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
					>
						<Box p={1}>
							<Button
								variant="contained"
								onClick={() => setVideoCaptureOpen(true)}
								disabled={form.context.values.upload.nofile}
							>
								Use Camera
							</Button>
						</Box>
						<Box p={1} alignItems="center" justifyContent="center">
							<FileUploadButton
								id="upload-photo"
								accept="image/*"
								variant="contained"
								onFileSelect={(files?: FileList) => handlePhotoSelect(files)}
								disabled={form.context.values.upload.nofile}
							>
								Upload Photo
							</FileUploadButton>
						</Box>
					</Box>
				</Box>
			</Item>
			<Item>
				<Box display="flex" justifyContent="flex-start">
					<Modal open={videoCaptureOpen}>
						<VideoCapture
							onCapture={handleVideoCapture}
							onError={handleVideoCaptureError}
							onCancel={handleVideoCaptureCancel}
						/>
					</Modal>
				</Box>
			</Item>
			<Item>
				<Typography variant="subtitle2">Attach Documents</Typography>
				<Typography variant="body1" color="textSecondary">
					Please upload any supporting documents (in PDF or Word format) necessary to
					fulfill your request.
				</Typography>
			</Item>
			<Item>
				<Box p={1} alignItems="center" justifyContent="center">
					<FileUploadButton
						id="upload-documents"
						accept=".doc,.docx,.pdf"
						variant="contained"
						multiple
						onFileSelect={(files?: FileList) => handleDocumentUpload(files)}
						disabled={form.context.values.upload.nofile}
					>
						Upload Document
					</FileUploadButton>
					{documentList.map((doc: File, index) => (
						<Box display="flex" p="1px" alignItems="center" key={index}>
							<IconButton
								color="secondary"
								aria-label="delete"
								onClick={() => handleDocumentRemove(doc)}
							>
								<DeleteForever />
							</IconButton>
							<Typography variant="body1" color="textPrimary">
								{doc.name}
							</Typography>
						</Box>
					))}
				</Box>
			</Item>
			<Item>
				<Grid container direction="row" spacing={0}>
					<Item xs={1}>
					<CheckboxInput
						name="upload.nofile"
						style={{marginLeft: "17px"}}
					/>
					</Item>
					<Item xs={11}>
						<ul>
							<li>I am unable or unwilling to provide a photo and copy of my ID.</li>
							<li>I am providing the last 4 of my social security number or state ID or Driver’s license number instead.</li>
							<li>I understand that if these data points cannot be matched to my medical records that RRS may contact me directly.</li>
						</ul>
					</Item>
				</Grid>
			</Item>
			{!form.values.upload.nofile ? null : (
				[
					<TextInput key="1" sm={6} name="patient.ssn" label="SSN (last 4 digits only)" />,
					<TextInput key="2" sm={6} name="patient.id" label="State ID or Driver's License #" />
				]
			)}

		</Container>
	);
}
