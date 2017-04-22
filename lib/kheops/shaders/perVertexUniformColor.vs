attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;
uniform vec3 uAmbientColor;
uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;
uniform vec3 uAmbientReflection;
uniform vec3 uDiffuseReflection;

varying vec3 vLightWeighting;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	vec3 transformedNormal = uNMatrix * aVertexNormal;
	float directionalLightWeighting = max( dot( transformedNormal, uLightingDirection), 0.0);
	vLightWeighting = (uAmbientColor * uAmbientReflection) + (uDirectionalColor * uDiffuseReflection * directionalLightWeighting);
}