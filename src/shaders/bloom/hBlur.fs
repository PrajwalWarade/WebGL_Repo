#version 300 es
precision mediump float;

in vec2 v_texcoord;

uniform sampler2D tex;
uniform float weight[5];
uniform float spread;

out vec4 fragColor;

void main() {
    vec2 texelOffset = vec2(1) / vec2(textureSize(tex, 0)) * spread;
    vec3 result = texture(tex, v_texcoord).rgb * weight[0];
    for(int i = 1; i < 5; ++i) {
        result += texture(tex, v_texcoord + vec2(texelOffset.x * float(i), 0.0f)).rgb * weight[i];
        result += texture(tex, v_texcoord - vec2(texelOffset.x * float(i), 0.0f)).rgb * weight[i];
    }
    fragColor = vec4(result, 1);
}
