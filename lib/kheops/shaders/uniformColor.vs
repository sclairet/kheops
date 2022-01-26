
// attributes
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

// uniform matrix
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

// ambient light
uniform vec3 uAmbientColor;

// directional light
uniform vec3 uDirectional;
uniform vec3 uDirectionalColor;

// point lights
uniform int uPointLightCount;

// material properties
uniform vec3 uAmbientReflection;
uniform vec3 uDiffuseReflection;
uniform vec3 uSpecularReflection;
uniform float uShininess;

// varying
varying vec3 vLightWeighting;

void main(void) {

	vec4 vertexPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
	gl_Position = uPMatrix * vertexPosition;

	vec3 transformedNormal = uNMatrix * aVertexNormal;
	vec3 surfaceNormal = normalize( transformedNormal);

	// camera
	vec3 viewDirection = vec3( 0.0, 0.0, 1.0);

	vLightWeighting = vec3( 0.0, 0.0, 0.0);

	// ambient color
	vLightWeighting += (uAmbientColor * uAmbientReflection);
	
	// directional lightweight
	vec3 normalizedDirectional = normalize(uDirectional);	
	float directionalDotProduct = dot( surfaceNormal, -normalizedDirectional);
	if (directionalDotProduct > 0.0) {
		vLightWeighting += (uDirectionalColor * uDiffuseReflection * directionalDotProduct);

		// specular lightweight
		if (length(uSpecularReflection) > 0.0) {
			vec3 reflectionDirection = reflect( normalizedDirectional, surfaceNormal);
			float dotProduct = dot( reflectionDirection, viewDirection);
			if (dotProduct > 0.0) {
				dotProduct = pow( dotProduct, uShininess);
				vLightWeighting += (uDirectionalColor * uSpecularReflection * dotProduct);
			}
		}
	}
}