let localStream;
let remoteStream;
let peerConnection;

const init = async () => {
	localStream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: false,
	});

	console.log(localStream);

	document.getElementById("user-1").srcObject = localStream;

	await createOffer();
};

let createOffer = async () => {
	peerConnection = new RTCPeerConnection(servers);

	remoteStream = new MediaStream();
	document.getElementById("user-2").srcObject = remoteStream;

	localStream.getTracks().forEach((track) => {
		console.log(track);

		peerConnection.addTrack(track, localStream);
	});

	peerConnection.ontrack = (event) => {
		event.streams[0].getTracks().forEach((track) => {
			remoteStream.addTrack(track);
		});
	};

	peerConnection.onicecandidate = async (event) => {
		if (event.candidate) {
			client.sendMessageToPeer(
				{
					text: JSON.stringify({
						type: "candidate",
						candidate: event.candidate,
					}),
				},
				MemberId
			);
		}
	};
};

init();
