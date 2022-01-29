precision mediump float;

uniform sampler2D uSampler;
uniform float uAlpha;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main(void) {
	vec4 lColor = texture2D( uSampler, vTextureCoord);
	gl_FragColor = vec4( lColor.rgb * vLightWeighting, lColor.a * uAlpha);
}