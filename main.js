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
	peerConnection = new RTCPeerConnection();

	peerConnection.ontrack = (event) => {
		console.log(event.streams[0])
	};

	remoteStream = new MediaStream();
	document.getElementById("user-2").srcObject = remoteStream;

	localStream.getTracks().forEach((track) => {
		peerConnection.addTrack(track, localStream);
	});

	/**
	 * ICE candidates are a crucial part of the WebRTC process, 
	 * but they are not included in the SDP offer. 
	 * Instead, ICE candidates are gathered separately 
	 * using the RTCPeerConnection's ICE agent. The process of gathering ICE candidates happens 
	 * asynchronously after you create the offer, 
	 * and you can listen for these candidates using the icecandidate event.
	 */

	// offer is the SDP offer from the sender peer
	const offer = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(offer);

	console.log('Local Description:', peerConnection.localDescription);

	peerConnection.onicecandidate = async (event) => {
		if(event.candidate) {
			console.log("New ICE Candidate", event.candidate)
		}
	}
};

init();
