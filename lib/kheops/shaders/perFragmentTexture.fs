precision mediump float;


// ambient light
uniform vec3 uAmbientColor;

// directional light
// reverse lighting direction
uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

// point lights
#define pointLightsCount 10
uniform int uPointLightsEnabled[pointLightsCount];
uniform vec3 uPointLightsColor[pointLightsCount];
uniform float uPointLightsDistance[pointLightsCount];

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

void main(void) {

	vec3 surfaceNormal = normalize( vTransformedNormal);
	vec3 directionalLightDirection = normalize(uLightingDirection);

	vec3 viewDirection = vec3( 0.0, 0.0, 1.0);
	
	vec3 lightWeighting = vec3( 0.0, 0.0, 0.0);

	// ambient color
	lightWeighting += (uAmbientColor * uAmbientReflection);
	
	// directional lightweight
	float directionalDotProduct = dot( surfaceNormal, directionalLightDirection);
	if (directionalDotProduct > 0.0) {
		lightWeighting += (uDirectionalColor * uDiffuseReflection * directionalDotProduct);

		// specular lightweight
		if (length(uSpecularReflection) > 0.0) {
			vec3 reflectionDirection = reflect( -directionalLightDirection, surfaceNormal);
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
			float dotProduct = dot( surfaceNormal, normalizedPointLightDirection);
			if (dotProduct > 0.0) {
				lightWeighting += (uPointLightsColor[i] * uDiffuseReflection * dotProduct);

			}
			if (length(uSpecularReflection) > 0.0) {
				vec3 reflectionDirection = reflect( -normalizedPointLightDirection, surfaceNormal);
				dotProduct = dot( reflectionDirection, viewDirection);
				if (dotProduct > 0.0) {
					dotProduct = pow( dotProduct, uShininess);
					lightWeighting += (uPointLightsColor[i] * uSpecularReflection * dotProduct);
				}
			}
		}
    }

	vec4 lColor = texture2D( uSampler, vTextureCoord);

	gl_FragColor = vec4( lColor.rgb * lightWeighting, lColor.a * uAlpha);
}