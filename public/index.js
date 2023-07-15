'use strict';

let button = document.getElementById("enter-vr")
let session = null
let gl = null
let ref_space = null

alert(window.navigator.xr)

if (navigator.xr) {
	session_end()

	button.addEventListener("click", () => {
		if (!session) {
			navigator.xr.requestSession("immersive-vr")
				.then(session_start)
		}

		else {
			session.end()
		}
	})
}

function session_end() {
	button.textContent = "Enter VR"

	session = null
	gl = null
}

function session_update(time, frame) {
	let session = frame.session
	session.requestAnimationFrame(session_update)

	let pose = frame.getViewerPose(ref_space)

	if (pose) {
		let layer = session.renderState.baseLayer
		gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer)

		gl.clearColor(Math.sin(time), 0, 1, 1)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	}
}

function session_start(_session) {
	session = _session
	button.textContent = "Exit VR"

	session.addEventListener("end", session_end)

	let canvas = document.createElement("canvas")
	gl = canvas.getContext("webgl", {
		xrCompatible: true,
	})

	session.updateRenderState({
		baseLayer: new XRWebGLLayer(session, gl),
	})

	session.requestReferenceSpace("local")
		.then((_ref_space) => {
			ref_space = _ref_space
			session.requestAnimationFrame(session_update)
		})
}
