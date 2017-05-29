precision mediump float;

uniform float uAlpha;

varying vec3 vLightWeighting;

void main(void) {
	gl_FragColor = vec4(vLightWeighting, uAlpha);
}