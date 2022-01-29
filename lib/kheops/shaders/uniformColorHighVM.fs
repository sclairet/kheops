precision mediump float;

uniform vec4 uColor;
uniform float uAlpha;

varying vec3 vLightWeighting;

void main(void) {
	gl_FragColor = vec4( uColor.rgb * vLightWeighting, uColor.a * uAlpha);
}