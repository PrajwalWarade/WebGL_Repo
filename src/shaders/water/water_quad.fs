#version 300 es

precision highp float;
precision highp sampler2D;
in vec4 clipSpaceCoords;
in vec2 a_texcoords_out;
in vec3 toCameraVector;

in vec3 mainLightDirection;

in vec3 a_position_out;
in vec3 outWorldPos;

uniform sampler2D u_reflectionTextureSampler;
uniform sampler2D u_refractionTextureSampler;
uniform sampler2D u_waterDUDVMapTextureSampler;
uniform sampler2D u_waterNormalMapTextureSampler;

uniform float u_moveFactorOffset;

uniform vec3 u_lightColor;

uniform vec3 u_lightPosition;
uniform vec4 u_fogColor;
uniform float u_maxDistance;
uniform float u_minDistance;

uniform float u_alpha;

uniform float waveStrength;

uniform float shininess;
uniform float reflectivity;

uniform int bEnbaleFog;
uniform float fogFalloff;
uniform vec3 fogColor;
uniform float gDispFactor;
uniform vec3 u_cameraPosition;
const float c = 18.f;
const float b = 3.e-6f;

uniform int bGodRaysPass;

uniform float u_sunDiskSize;
uniform float u_sunIntensity;
uniform vec3 u_sunColor;

// const float waveStrength = 0.1f;

// uniform float shininess = 10.0f;
// uniform float reflectivity = 0.6f;

out vec4 FragColor;

float applyFog(
	in vec3 rgb,      // original color of the pixel
	in float dist, // camera to point distance
	in vec3 cameraPos,   // camera position
	in vec3 rayDir
)  // camera to point vector
{
	float dist2 = dist * 0.1f;
	float fogAmount = c * exp(-cameraPos.y * fogFalloff) * (1.0f - exp(-dist2 * rayDir.y * fogFalloff)) / rayDir.y;
	vec3 fogColor = vec3(0.5f, 0.6f, 0.7f);
    //return clamp(fogAmount, 0.0f, 1.0f);//mix( rgb, fogColor, fogAmount );
	return fogAmount;//mix( rgb, fogColor, fogAmount );
}

// Sun disk reflection function
vec3 calculateSunReflection(vec3 viewDir, vec3 normal, vec3 lightDir)
{
	// Code
    // Calculate perfect reflection direction
    vec3 reflectedView = reflect(-viewDir, normal);
    
    // Calculate how aligned the reflection is with sun direction
    float sunAlignment = max(dot(reflectedView, -lightDir), 0.0);
    
    float sunIntensity = pow(sunAlignment, u_sunDiskSize);
    
    // Add outer glow for evening effect
	float outerGlow = pow(sunAlignment, u_sunDiskSize * 0.3);
    
    // Combine disk + glow
	float totalSunEffect = sunIntensity + outerGlow * 0.4;

    return u_sunColor * totalSunEffect * u_sunIntensity;
}

// vec3 computeNormals(vec3 WorldPos){
// 	float st = 0.35;
// 	float dhdu = (perlin((WorldPos.x + st), WorldPos.z, u_moveFactorOffset*10.0) - perlin((WorldPos.x - st), WorldPos.z, u_moveFactorOffset*10.0))/(2.0*st);
// 	float dhdv = (perlin( WorldPos.x, (WorldPos.z + st), u_moveFactorOffset*10.0) - perlin(WorldPos.x, (WorldPos.z - st), moveFacuu_moveFactorOffset_moveFactorOffsettor*10.0))/(2.0*st);

// 	vec3 X = vec3(1.0, dhdu, 1.0);
// 	vec3 Z = vec3(0.0, dhdv, 1.0);

// 	vec3 n = normalize(cross(Z,X));
// 	vec3 norm = mix(n, Normal, 0.5); 
// 	norm = normalize(norm);
// 	return norm;
// }

void main(void) {
                // Perspective Division - to convert Clip Space Co-ordinate to Normalized Device Space Co-ordinates

	if(bGodRaysPass == 1) {
		FragColor = vec4(0.0f);
	} else {

		vec2 ndcCoords = (clipSpaceCoords.xy / clipSpaceCoords.w) / 2.0f + 0.5f;

		vec2 distortedTexCoords = texture(u_waterDUDVMapTextureSampler, vec2(a_texcoords_out.x + u_moveFactorOffset, a_texcoords_out.y)).rg * 0.1f;
		distortedTexCoords = a_texcoords_out + vec2(distortedTexCoords.x, distortedTexCoords.y + u_moveFactorOffset);
		vec2 totalDistortions = (texture(u_waterDUDVMapTextureSampler, distortedTexCoords).rg * 2.0f - 1.0f) * waveStrength;

		vec2 reflectTexcoords = vec2(ndcCoords.x, -ndcCoords.y);
		reflectTexcoords = reflectTexcoords + totalDistortions;
		reflectTexcoords.x = clamp(reflectTexcoords.x, 0.001f, 0.999f);
		reflectTexcoords.y = clamp(reflectTexcoords.y, -0.999f, -0.001f);
		vec4 reflectColor = texture(u_reflectionTextureSampler, reflectTexcoords);

		vec2 refractTexcoords = vec2(ndcCoords.x, ndcCoords.y);
		refractTexcoords = refractTexcoords + totalDistortions;
		refractTexcoords = clamp(refractTexcoords, 0.001f, 0.999f);
		vec4 refractColor = texture(u_refractionTextureSampler, refractTexcoords);

		vec3 viewVector = normalize(toCameraVector);
		vec3 waterSurfaceNormal = vec3(0.0f, 1.0f, 0.0f);
		float refractiveFactor = dot(viewVector, waterSurfaceNormal);
		refractiveFactor = pow(refractiveFactor, reflectivity); // Higher the power, greater the reflectivity

		vec4 normalMapColor = texture(u_waterNormalMapTextureSampler, distortedTexCoords);
		vec3 normal = vec3(normalMapColor.r * 2.0f - 1.0f, normalMapColor.b, normalMapColor.g * 2.0f - 1.0f);
		normal = normalize(normal);

		float specularFactor = 0.8f;
		vec3 reflectedLight = reflect(normalize(mainLightDirection), normal);
		float specular = max(dot(reflectedLight, viewVector), 0.0f);
		specular = pow(specular, shininess);
		vec3 specularHighlights = u_lightColor * specular * specularFactor;

        // Calculate sun disk reflection
        vec3 sunReflection = calculateSunReflection(viewVector, normal, normalize(mainLightDirection));

		// calculate diffuse illumination
		totalDistortions = normalize(totalDistortions);
		vec3 X = vec3(1.0f, totalDistortions.r, 1.0f);
		vec3 Z = vec3(0.0f, totalDistortions.g, 1.0f);
		vec3 norm = texture(u_waterNormalMapTextureSampler, totalDistortions).rgb;
		norm = vec3(norm.r * 2.0f - 1.0f, norm.b * 1.5f, norm.g * 2.0f - 1.0f);
		//norm = normalize(cross(X, Z));
		// norm = computeNormals(position.xyz);
		norm = normal;
		norm = mix(norm, vec3(0.0f, 1.0f, 0.0f), 0.25f);
		vec3 lightDir = normalize(u_lightPosition - a_position_out.xyz);
		// vec3 lightDir = normalize(u_LightPosition - a_position_out.xyz);
		float diffuseFactor = max(0.0f, dot(lightDir, norm.rgb));
		float diffuseConst = 0.5f;
		vec3 diffuse = diffuseFactor * diffuseConst * u_lightColor;

		vec4 waterColor = mix(reflectColor, refractColor, refractiveFactor);
		//vec4 waterColor = reflectColor;
		// vec4 waterColor = refractColor;
		waterColor = mix(waterColor, vec4(0.3, 0.3, 0.3, 1.0f), 0.8f) + vec4(specularHighlights + diffuse + sunReflection, 0.0f);
		// waterColor = mix(mix(refr_reflCol, color*0.8, 0.1)*0.8 + vec4(diffuse + specular, 1.0) , fogColor,(1 - fogFactor));

		if(bEnbaleFog == 1) {
			float fogFactor = applyFog(vec3(0.0f), distance(vec3(u_cameraPosition[0], 1.938201904296875f, u_cameraPosition[2]), outWorldPos), vec3(u_cameraPosition[0], 1.938201904296875f, u_cameraPosition[2]), normalize(outWorldPos - vec3(u_cameraPosition[0], 1.938201904296875f, u_cameraPosition[2])));

        // Frag_Color = mix(color, vec4(fogColor, 1.0), fogFactor);
			FragColor = mix(waterColor, vec4(mix(fogColor * 1.1f, fogColor * 0.85f, clamp(outWorldPos.y / 0.1f, 0.0f, 0.3f)), 1.0f), fogFactor);

        //Frag_Color = mix(color, vec4(mix(fogColor * 1.1f, fogColor * 0.85f, smoothFactor), 1.0f), fogFactor);
		} else {
			FragColor = waterColor * u_alpha;
		}
	}
}