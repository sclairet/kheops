attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

// point lights
#define pointLightsCount 5
uniform int uPointLightsEnabled[pointLightsCount];
uniform vec3 uPointLightsPosition[pointLightsCount];
uniform mat4 uPointLightsMvMatrix[pointLightsCount];

// spot lights
#define spotLightsCount 5
uniform int uSpotLightsEnabled[spotLightsCount];
uniform vec3 uSpotLightsDirection[spotLightsCount];
uniform vec3 uSpotLightsPosition[spotLightsCount];
uniform mat4 uSpotLightsMvMatrix[spotLightsCount];

varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec2 vTextureCoord;

varying vec3 vCurrentPointLightsDirection[pointLightsCount];
varying float vCurrentPointLightsDistance[pointLightsCount];

varying vec3 vVertexSpotLightsDirection[spotLightsCount];
varying vec3 vSpotLightsDirection[spotLightsCount];

void main(void) {
	vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);

	gl_Position = uPMatrix * vPosition;
	vTransformedNormal = uNMatrix * aVertexNormal;
	vTextureCoord = aTextureCoord;

	// point lights
	for (int i = 0; i < pointLightsCount; ++i) {
		if (uPointLightsEnabled[i] == 1) {
			vec4 pointLightPos = uPointLightsMvMatrix[i] * vec4(uPointLightsPosition[i], 1.0);
			vCurrentPointLightsDistance[i] = distance(vPosition, pointLightPos);
			vCurrentPointLightsDirection[i] = (vPosition - pointLightPos).xyz;
		}
		else {
			vCurrentPointLightsDirection[i] = vec3(0.0, 0.0, 0.0);
		}
    }

	// spot lights
	for (int i = 0; i < spotLightsCount; ++i) {
		if (uSpotLightsEnabled[i] == 1) {
			vec4 spotLightPos = uSpotLightsMvMatrix[i] * vec4(uSpotLightsPosition[i], 1.0);
			vVertexSpotLightsDirection[i] = (vPosition - spotLightPos).xyz;
			vec4 lightDirection = uSpotLightsMvMatrix[i] * vec4(uSpotLightsDirection[i], 1.0);
			vSpotLightsDirection[i] = lightDirection.xyz;
		}
		else {
			vVertexSpotLightsDirection[i] = vec3(0.0, 0.0, 0.0);
		}
    }
}