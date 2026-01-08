#version 300 es

precision mediump float;

in vec4 outColor;
in vec2 outTexCoord;

uniform sampler2D uTextureSampler;

out vec4 fragColor;

void main() {
	vec4 textureColor = texture(uTextureSampler, outTexCoord);

	// fragColor = vec4(1.0f, 0.0f, 0.0f, 1.0f);//outColor * textureColor;
	fragColor = outColor * textureColor;
}
