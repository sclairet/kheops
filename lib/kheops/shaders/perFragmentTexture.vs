attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

// point lights
#define pointLightsCount 10
uniform int uPointLightsEnabled[pointLightsCount];
uniform vec3 uPointLightsPosition[pointLightsCount];

varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec2 vTextureCoord;
varying vec3 vCurrentPointLightsDirection[pointLightsCount];
varying float vCurrentPointLightsDistance[pointLightsCount];

void main(void) {
	vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);

	gl_Position = uPMatrix * vPosition;
	vTransformedNormal = uNMatrix * aVertexNormal;
	vTextureCoord = aTextureCoord;

	// point lights
	for (int i = 0; i < pointLightsCount; ++i) {
		if (uPointLightsEnabled[i] == 1) {
			vec4 pointLightPos = vec4(uPointLightsPosition[i], 1.0);
			vCurrentPointLightsDistance[i] = distance(vPosition, pointLightPos) ;
			vCurrentPointLightsDirection[i] = (pointLightPos - vPosition).xyz;
		}
		else {
			vCurrentPointLightsDirection[i] = vec3(0.0, 0.0, 0.0);
		}
    }

}