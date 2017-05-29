precision mediump float;

uniform vec3 uAmbientColor;
uniform vec3 uLightingDirection;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;
uniform vec3 uAmbientReflection;
uniform vec3 uDiffuseReflection;
uniform vec3 uSpecularReflection;
uniform float uShininess;
uniform float uAlpha;
uniform sampler2D uSampler;

varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec2 vTextureCoord;

void main(void) {
	vec3 surfaceNormal = normalize( vTransformedNormal);
	vec3 viewDirection = vec3( 0.0, 0.0, 1.0);
	vec3 reflectionDirection = reflect( -uLightingDirection, surfaceNormal);

	float directionalLightWeight = max( dot( surfaceNormal, uLightingDirection), 0.0);

	float specularLightWeight = max( dot( reflectionDirection, viewDirection), 0.0);
	specularLightWeight = pow( specularLightWeight, uShininess);

	vec4 lTextColor = texture2D( uSampler, vTextureCoord);

	vec3 lightWeighting =		(uAmbientColor * uAmbientReflection)
							+	(uDiffuseColor * lTextColor.rgb * uDiffuseReflection * directionalLightWeight)
							+	(uSpecularColor * uSpecularReflection * specularLightWeight);

	gl_FragColor = vec4(lightWeighting, uAlpha);
}