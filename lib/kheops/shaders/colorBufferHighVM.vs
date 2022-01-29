
// attributes
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

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
#define maxPointLightCount 5
uniform int uPointLightCount;
uniform vec3 uPointLightPosition[maxPointLightCount];
uniform mat4 uPointLightMvMatrix[maxPointLightCount];
uniform vec3 uPointLightColor[maxPointLightCount];

// spot lights
#define maxSpotLightCount 5
uniform int uSpotLightCount;
uniform vec3 uSpotLightDirection[maxSpotLightCount];
uniform vec3 uSpotLightPosition[maxSpotLightCount];
uniform mat4 uSpotLightMvMatrix[maxSpotLightCount];
uniform vec3 uSpotLightColor[maxSpotLightCount];
uniform float uSpotLightInsideLimit[maxSpotLightCount];
uniform float uSpotLightOutsideLimit[maxSpotLightCount];

// material properties
uniform vec3 uAmbientReflection;
uniform vec3 uDiffuseReflection;
uniform vec3 uSpecularReflection;
uniform float uShininess;

// varying
varying vec3 vLightWeighting;
varying vec4 vColor;

void main(void) {

	vColor = aVertexColor;

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

	// point lights
	for (int i = 0; i < maxPointLightCount; ++i) {
		if (i < uPointLightCount) {
			vec4 pointLightPos = uPointLightMvMatrix[i] * vec4(uPointLightPosition[i], 1.0);
			
			float lightDistance = distance(vertexPosition, pointLightPos);
			
			vec3 vertexLightDirection = (vertexPosition - pointLightPos).xyz;
			vertexLightDirection = normalize(vertexLightDirection);

			float dotProduct = dot( surfaceNormal, -vertexLightDirection);
			if (dotProduct > 0.0) {
				vLightWeighting += (uPointLightColor[i] * uDiffuseReflection * dotProduct);

			}
			if (length(uSpecularReflection) > 0.0) {
				vec3 reflectionDirection = reflect( vertexLightDirection, surfaceNormal);
				dotProduct = dot( reflectionDirection, viewDirection);
				if (dotProduct > 0.0) {
					dotProduct = pow( dotProduct, uShininess);
					vLightWeighting += (uPointLightColor[i] * uSpecularReflection * dotProduct);
				}
			}
		}
    }

	// spot lights
	for (int i = 0; i < maxSpotLightCount; ++i) {
		if (i < uSpotLightCount) {
			vec4 spotLightPos = uSpotLightMvMatrix[i] * vec4(uSpotLightPosition[i], 1.0);
			
			vec3 vertexLightDirection = (vertexPosition - spotLightPos).xyz;
			vertexLightDirection = normalize(vertexLightDirection);

			vec4 lightDirection = vec4(uSpotLightDirection[i], 1.0);
			vec3 spotLightDirection = normalize(lightDirection.xyz);

			float dotProduct = dot( spotLightDirection, vertexLightDirection);
			float insideLimit = 0.0;
			float limitFactor = 0.0;
			if (uSpotLightInsideLimit[i] > 0.0) {
				insideLimit = cos(uSpotLightInsideLimit[i]);
			}
			if (uSpotLightOutsideLimit[i] > 0.0) {
				float outsideLimit = cos(uSpotLightOutsideLimit[i]);
				limitFactor = smoothstep(outsideLimit, insideLimit, dotProduct);
			}
			else {
				limitFactor = step(insideLimit, dotProduct);
			}
			float lightFactor = limitFactor * dot( surfaceNormal, -vertexLightDirection);
			vLightWeighting += (uSpotLightColor[i] * uDiffuseReflection * lightFactor);

			if (length(uSpecularReflection) > 0.0) {
				vec3 reflectionDirection = reflect( vertexLightDirection, surfaceNormal);
				dotProduct = limitFactor * dot( reflectionDirection, viewDirection);
				if (dotProduct > 0.0) {
					dotProduct = pow( dotProduct, uShininess);
					vLightWeighting += (uSpotLightColor[i] * uSpecularReflection * dotProduct);
				}
			}
		}
    }
}