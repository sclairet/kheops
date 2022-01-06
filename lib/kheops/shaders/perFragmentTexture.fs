precision mediump float;

uniform vec3 uAmbientColor;

// reverse lighting direction
uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

uniform vec3 uPointLightColor_0;
uniform vec3 uPointLightDirection_0;

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
varying vec3 vPointLightDirection_0;
varying float vPointLightDistance_0;

void main(void) {

	vec3 surfaceNormal = normalize( vTransformedNormal);
	vec3 pointLightDirection_0 = normalize(vPointLightDirection_0);

	vec3 viewDirection = vec3( 0.0, 0.0, 1.0);
	
	vec3 lightWeighting = vec3( 0.0, 0.0, 0.0);

	// ambient color
	lightWeighting += (uAmbientColor * uAmbientReflection);
	
	// directional lightweight
	float directionalDotProduct = min( dot( surfaceNormal, uLightingDirection), 1.0);
	if (directionalDotProduct > 0.0) {
		lightWeighting += (uDirectionalColor * uDiffuseReflection * directionalDotProduct);
	}

	// point light
	float pointDotProduct = min(dot( surfaceNormal, vPointLightDirection_0), 1.0);
	if (pointDotProduct > 0.0) {
		lightWeighting += (uPointLightColor_0 * uDiffuseReflection * pointDotProduct);
	}

	// specular lightweight
	if (directionalDotProduct > 0.0) {
		vec3 reflectionDirection = reflect( -uLightingDirection, surfaceNormal);
		float dotProduct = min(dot( reflectionDirection, viewDirection), 1.0);
		if (dotProduct > 0.0) {
			dotProduct = pow( dotProduct, uShininess);
			lightWeighting += (uDirectionalColor * uSpecularReflection * dotProduct);
		}
	}

	if (pointDotProduct > 0.0) {
		vec3 reflectionDirection = reflect( -vPointLightDirection_0, surfaceNormal);
		float dotProduct = min(dot( reflectionDirection, viewDirection), 1.0);
		if (dotProduct > 0.0) {
			dotProduct = pow( dotProduct, uShininess);
			lightWeighting += (uPointLightColor_0 * uSpecularReflection * dotProduct * 0.01);
		}
	}

	//vec3 lightWeighting =		(uAmbientColor * uAmbientReflection)
	//						+	(uDirectionalColor * uDiffuseReflection * directionalLightWeight)
	//						+	(uPointLightColor_0 * uDiffuseReflection * pointLightWeight0);

	vec4 lColor = texture2D( uSampler, vTextureCoord);

	gl_FragColor = vec4( lColor.rgb * lightWeighting, lColor.a * uAlpha);
}