precision mediump float;


// ambient light
uniform vec3 uAmbientColor;

// directional light
uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

// point lights
#define pointLightsCount 5
uniform int uPointLightsEnabled[pointLightsCount];
uniform vec3 uPointLightsColor[pointLightsCount];
uniform float uPointLightsDistance[pointLightsCount];

// spot lights
#define spotLightsCount 5
uniform vec3 uSpotLightsColor[spotLightsCount];
uniform float uSpotLightsInsideLimit[spotLightsCount];
uniform float uSpotLightsOutsideLimit[spotLightsCount];

uniform vec3 uAmbientReflection;
uniform vec3 uDiffuseReflection;
uniform vec3 uSpecularReflection;

uniform float uShininess;
uniform float uAlpha;
uniform sampler2D uSampler;

uniform mat4 uPMatrix;

varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec2 vTextureCoord;

varying vec3 vCurrentPointLightsDirection[pointLightsCount];
varying float vCurrentPointLightsDistance[pointLightsCount];

varying vec3 vVertexSpotLightsDirection[spotLightsCount];
varying vec3 vSpotLightsDirection[spotLightsCount];


void main(void) {

	vec3 surfaceNormal = normalize( vTransformedNormal);
	vec3 normalizedDirectional = normalize(uLightingDirection);

	vec3 viewDirection = vec3( 0.0, 0.0, 1.0);
	
	vec3 lightWeighting = vec3( 0.0, 0.0, 0.0);

	// ambient color
	lightWeighting += (uAmbientColor * uAmbientReflection);
	
	// directional lightweight
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
	for (int i = 0; i < pointLightsCount; ++i) {
		if (length(vCurrentPointLightsDirection[i]) > 0.0) {
			vec3 normalizedPointLightDirection = normalize(vCurrentPointLightsDirection[i]);
			float dotProduct = dot( surfaceNormal, -normalizedPointLightDirection);
			if (dotProduct > 0.0) {
				lightWeighting += (uPointLightsColor[i] * uDiffuseReflection * dotProduct);

			}
			if (length(uSpecularReflection) > 0.0) {
				vec3 reflectionDirection = reflect( normalizedPointLightDirection, surfaceNormal);
				dotProduct = dot( reflectionDirection, viewDirection);
				if (dotProduct > 0.0) {
					dotProduct = pow( dotProduct, uShininess);
					lightWeighting += (uPointLightsColor[i] * uSpecularReflection * dotProduct);
				}
			}
		}
    }

	// spot lights
	for (int i = 0; i < spotLightsCount; ++i) {
		if (length(vVertexSpotLightsDirection[i]) > 0.0) {
			vec3 spotLightDirection = normalize(vSpotLightsDirection[i]);
			vec3 vertexLightDirection = normalize(vVertexSpotLightsDirection[i]);
			float dotProduct = dot( spotLightDirection, vertexLightDirection);
			float insideLimit = 0.0;
			float limitFactor = 0.0;
			if (uSpotLightsInsideLimit[i] > 0.0) {
				insideLimit = cos(uSpotLightsInsideLimit[i]);
			}
			if (uSpotLightsOutsideLimit[i] > 0.0) {
				float outsideLimit = cos(uSpotLightsOutsideLimit[i]);
				limitFactor = smoothstep(outsideLimit, insideLimit, dotProduct);
			}
			else {
				limitFactor = step(insideLimit, dotProduct);
			}
			float lightFactor = limitFactor * dot( surfaceNormal, -vertexLightDirection);
			lightWeighting += (uSpotLightsColor[i] * uDiffuseReflection * lightFactor);

			if (length(uSpecularReflection) > 0.0) {
				vec3 reflectionDirection = reflect( vertexLightDirection, surfaceNormal);
				dotProduct = limitFactor * dot( reflectionDirection, viewDirection);
				if (dotProduct > 0.0) {
					dotProduct = pow( dotProduct, uShininess);
					lightWeighting += (uSpotLightsColor[i] * uSpecularReflection * dotProduct);
				}
			}
		}
    }

	vec4 lColor = texture2D( uSampler, vTextureCoord);

	gl_FragColor = vec4( lColor.rgb * lightWeighting, lColor.a * uAlpha);
}