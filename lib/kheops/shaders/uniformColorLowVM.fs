precision mediump float;

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
uniform vec4 uColor;
uniform float uAlpha;

// varying
varying vec3 vTransformedNormal;
varying vec4 vVertexPosition;

void main(void) {

	vec3 surfaceNormal = normalize( vTransformedNormal);

	// camera
	vec3 viewDirection = vec3( 0.0, 0.0, 1.0);

	vec3 lightWeighting = vec3( 0.0, 0.0, 0.0);

	// ambient color
	lightWeighting += (uAmbientColor * uAmbientReflection);
	
	// directional lightweight
	vec3 normalizedDirectional = normalize(uDirectional);	
	float directionalDotProduct = dot( surfaceNormal, -normalizedDirectional);
	if (directionalDotProduct > 0.0) {
		lightWeighting += (uDirectionalColor * uDiffuseReflection * directionalDotProduct);

		// specular lightweight
		if (length(uSpecularReflection) > 0.0) {
			vec3 reflectionDirection = reflect( normalizedDirectional, surfaceNormal);
			float dotProduct = dot( reflectionDirection, viewDirection);
			if (dotProduct > 0.0) {
				dotProduct = pow( dotProduct, uShininess);
				lightWeighting += (uDirectionalColor * uSpecularReflection * dotProduct);
			}
		}
	}

	// point lights
	for (int i = 0; i < maxPointLightCount; ++i) {
		if (i < uPointLightCount) {
			vec4 pointLightPos = uPointLightMvMatrix[i] * vec4(uPointLightPosition[i], 1.0);
			
			float lightDistance = distance(vVertexPosition, pointLightPos);
			
			vec3 vertexLightDirection = (vVertexPosition - pointLightPos).xyz;
			vertexLightDirection = normalize(vertexLightDirection);

			float dotProduct = dot( surfaceNormal, -vertexLightDirection);
			if (dotProduct > 0.0) {
				lightWeighting += (uPointLightColor[i] * uDiffuseReflection * dotProduct);

			}
			if (length(uSpecularReflection) > 0.0) {
				vec3 reflectionDirection = reflect( vertexLightDirection, surfaceNormal);
				dotProduct = dot( reflectionDirection, viewDirection);
				if (dotProduct > 0.0) {
					dotProduct = pow( dotProduct, uShininess);
					lightWeighting += (uPointLightColor[i] * uSpecularReflection * dotProduct);
				}
			}
		}
    }

	// spot lights
	for (int i = 0; i < maxSpotLightCount; ++i) {
		if (i < uSpotLightCount) {
			vec4 spotLightPos = uSpotLightMvMatrix[i] * vec4(uSpotLightPosition[i], 1.0);
			
			vec3 vertexLightDirection = (vVertexPosition - spotLightPos).xyz;
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
			lightWeighting += (uSpotLightColor[i] * uDiffuseReflection * lightFactor);

			if (length(uSpecularReflection) > 0.0) {
				vec3 reflectionDirection = reflect( vertexLightDirection, surfaceNormal);
				dotProduct = limitFactor * dot( reflectionDirection, viewDirection);
				if (dotProduct > 0.0) {
					dotProduct = pow( dotProduct, uShininess);
					lightWeighting += (uSpotLightColor[i] * uSpecularReflection * dotProduct);
				}
			}
		}
    }

	gl_FragColor = vec4( uColor.rgb * lightWeighting, uColor.a * uAlpha);
}