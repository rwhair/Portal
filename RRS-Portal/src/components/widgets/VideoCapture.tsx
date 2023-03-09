import React from "react";
import { Box, Button, Paper, Typography } from "@material-ui/core";

export interface VideoCaptureProps {
	open?: boolean;
	onError(err: string): void;
	onCancel(): void;
	onCapture(src: string): void;
}

export default function VideoCapture(props: VideoCaptureProps) {
	const [takePicture, setTakePicture] = React.useState(false);

	React.useEffect(() => {
		if (!("mediaDevices" in navigator)) {
			props.onError("Media capture not supported on this device!");
			return;
		}

		const video = document.getElementById("video") as HTMLMediaElement;
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then(stream => {
				video.srcObject = stream;
			})
			.catch((reason: any) => {
				const err = typeof reason === "string" ? reason : "Error accessing webcam!";
				props.onError(err);
				return;
			});

		return () => {
			if (video) {
				video.pause();
				if (video.srcObject) {
					(video.srcObject as MediaStream)
						.getVideoTracks()
						.forEach(track => track.stop());
					video.srcObject = null;
				}
			}
		};
	}, [props]);

	React.useEffect(() => {
		if (!takePicture) {
			return;
		}

		const video = document.getElementById("video") as HTMLVideoElement;
		const canvas = document.createElement("canvas");
		canvas.width = video.clientWidth;
		canvas.height = video.clientHeight;
		canvas.style.maxWidth = "90%";

		const context = canvas.getContext("2d");
		if (context == null) {
			alert("Error taking picture from webcam!");
			return;
		}

		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		props.onCapture(canvas.toDataURL());
	}, [props, takePicture]);

	return (
		<Box
			p={2}
			width="100%"
			height="100%"
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<Paper>
				<Box
					p={2}
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
				>
					<Box p={2}>
						<Typography variant="subtitle1" align="center">
							Please take a photo of yourself holding your photo ID.
						</Typography>
						<Typography variant="body1" align="center">
							Be sure that your face and ID are both clearly visible in the photo. If
							your photo is not readable, you may be contacted for verification.
						</Typography>
					</Box>
					<Box display="flex" alignItems="center" justifyContent="center">
						<video
							id="video"
							controls={false}
							autoPlay={true}
							style={{
								maxWidth: "75%",
								maxHeight: "75%",
								padding: "1px",
								border: "2px dashed #9399a7",
							}}
						/>
					</Box>
					<Box p={2} width="100%" display="flex" justifyContent="space-between">
						<Button
							variant="contained"
							color="primary"
							onClick={() => setTakePicture(true)}
						>
							Take Photo
						</Button>
						<Button
							variant="contained"
							color="secondary"
							onClick={() => props.onCancel()}
						>
							Cancel
						</Button>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
}
