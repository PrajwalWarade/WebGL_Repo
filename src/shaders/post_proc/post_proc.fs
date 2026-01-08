#version 300 es

precision mediump float;

out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D screenTexture;
uniform sampler2D cloudTEX;
uniform sampler2D depthTex;

uniform sampler2D fbmTexture;
uniform int enableFMB;

uniform bool wireframe;

uniform vec2 resolution;

uniform float u_vignetteOuterRadius;
uniform float u_vignetteInnerRadius;

uniform float alpha;

#define HDR(col, exps) 1.0 - exp(-col * exps)

vec3 TonemapACES(vec3 x) {
	const float A = 2.51f;
	const float B = 0.03f;
	const float C = 2.43f;
	const float D = 0.59f;
	const float E = 0.14f;
	return (x * (A * x + B)) / (x * (C * x + D) + E);
}

// BLOOM
uniform int bEnableBloom;
uniform sampler2D u_sceneBloom;
uniform sampler2D u_sceneBlur;
uniform float mult_bloom;
uniform float exposure_bloom;
uniform float gamma_bloom;

// GOD RAYS
uniform int bEnableGodRays;

uniform float godrays_exposure;
uniform float godrays_decay;
uniform float godrays_density;
uniform float godrays_weight;
uniform vec2 godrays_lightPositionOnScreen[2];

uniform sampler2D godrays_ColorMapSampler;

const int NUM_SAMPLES = 500;

void main() {

	//	Main Scene, Terrain + SKy Dome
	vec4 cloud = texture(cloudTEX, TexCoords);
	vec4 bg = texture(screenTexture, TexCoords);
	float mixVal = (texture(depthTex, TexCoords).r < 1.0f ? 0.0f : 1.0f);
	vec4 color = mix(bg, cloud, (!wireframe ? mixVal : 0.0f));

	const float gamma = 2.2f;
	const float exposure = 3.0f;

	vec2 uv = gl_FragCoord.xy / resolution;

	color.rgb *= pow(16.0f * uv.x * uv.y * (1.0f - uv.x) * (1.0f - uv.y), 0.11f);

	// BLOOM
	// if(bEnableBloom == 1) {
	// 	vec3 color1_Bloom = texture(u_sceneBloom, TexCoords).rgb;
	// 	vec3 color2_Blur = texture(u_sceneBlur, TexCoords).rgb;
	// 	vec3 color_Bloom = color1_Bloom + color2_Blur * mult_bloom;
	// 	// tone mapping
	// 	vec3 result = vec3(1.0f) - exp(-color_Bloom * exposure_bloom);

	// 	// also gamma correct while we're at it       
	// 	result = pow(result, vec3(1.0f / gamma_bloom));
	// 	if(result[0] < 0.1f && result[1] < 0.1f && result[2] < 0.1f) {
	// 		color = mix(vec4(result, 1.0f), color, 0.2f);
	// 	} else {
	// 		color = mix(vec4(result, 1.0f), color, 0.4f);

	// 	}
	// 	FragColor = color;

	// }
	if(bEnableGodRays == 1) {
		vec4 godRaysColor;
		godRaysColor = texture(godrays_ColorMapSampler, TexCoords) * 0.4f;
		for(int clpos = 0; clpos < 1; clpos++) {

			vec2 textCoo = TexCoords;
			vec2 deltaTextCoord = vec2(textCoo - godrays_lightPositionOnScreen[clpos]);
			deltaTextCoord *= 1.0f / float(NUM_SAMPLES) * godrays_density;
			float illuminationDecay = 1.0f;

			for(int i = 0; i < NUM_SAMPLES; i++) {
				textCoo -= deltaTextCoord;
				vec4 sampleColor = texture(godrays_ColorMapSampler, textCoo) * 0.4f;
				sampleColor *= illuminationDecay * godrays_weight;
				godRaysColor += sampleColor;
				illuminationDecay *= godrays_decay;
			}
		}
		color = ((vec4((vec3(godRaysColor.r, godRaysColor.g, godRaysColor.b) * godrays_exposure), 1.0f)) + (color * (1.1f)));
	}

	// Vignette
	vec2 relativePosition;
	relativePosition.x = (gl_FragCoord.x / resolution.x);
	relativePosition.x = relativePosition.x - 0.5f;
	relativePosition.y = (gl_FragCoord.y / resolution.y);
	relativePosition.y = relativePosition.y - 0.5f;
	float len = length(relativePosition);
	float vignette = smoothstep(u_vignetteOuterRadius, u_vignetteInnerRadius, len);
	vec3 tempVignetteColor;
	tempVignetteColor = mix(color.rgb, color.rgb * vignette, 1.0f);
	vec4 vignetteColor;
	vignetteColor = vec4(tempVignetteColor, color.a);

	if(enableFMB == 1)
		FragColor = mix(vignetteColor, texture(fbmTexture, TexCoords), 0.3f) * alpha;
	else
		FragColor = vignetteColor * alpha;
}