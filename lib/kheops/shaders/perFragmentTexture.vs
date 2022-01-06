attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;
uniform vec3 uPointLightPosition_0;

varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec2 vTextureCoord;
varying vec3 vPointLightDirection_0;
varying float vPointLightDistance_0;

void main(void) {
	vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
	vec4 pointLightPosition_0 = vec4(uPointLightPosition_0, 1.0);
	vPointLightDistance_0 = distance(vPosition, pointLightPosition_0) ;
	vPointLightDirection_0 = (pointLightPosition_0 - vPosition).xyz;
	gl_Position = uPMatrix * vPosition;
	vTransformedNormal = uNMatrix * aVertexNormal;
	vTextureCoord = aTextureCoord;
}