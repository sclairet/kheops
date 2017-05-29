attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 uAmbientColor;
uniform vec3 uLightingDirection;
uniform vec3 uDiffuseColor;
uniform mat3 uNMatrix;
uniform vec3 uAmbientReflection;
uniform vec3 uDiffuseReflection;
uniform sampler2D uSampler;

varying vec3 vLightWeighting;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	vec3 transformedNormal = uNMatrix * aVertexNormal;
	float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
	vec4 lTextColor = texture2D(uSampler, aTextureCoord);

	vLightWeighting =		(uAmbientColor * uAmbientReflection)
						+	(uDiffuseColor * lTextColor.rgb * uDiffuseReflection * directionalLightWeighting);
}