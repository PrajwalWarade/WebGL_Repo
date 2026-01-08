#version 300 es
precision mediump float;
in vec2 v_texcoord; 
in float v_fogDepth;
out vec4 FragColor;
uniform sampler2D uTextureSampler;
uniform vec4 uFogColor;
uniform float uFogDensity;
uniform float uFogNear;
uniform float uFogFar;
void main(void)
{
    vec4 color = texture(uTextureSampler, v_texcoord);
    float fogFactor = clamp((v_fogDepth - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
    float fogAmount = fogFactor * (1.0 - exp(-uFogDensity * v_fogDepth));
    FragColor = mix(color, uFogColor, fogAmount);
}

