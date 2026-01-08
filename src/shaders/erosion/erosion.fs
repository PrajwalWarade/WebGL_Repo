#version 300 es

precision highp float;

in vec3 oTexCoord;
uniform sampler2D uTextureSampler;
uniform highp sampler3D uNoiseTextureSampler;
uniform float uLowThreshold;
uniform float uHighThreshold;
out vec4 FragColor;

void main(void)
{
    vec4 noise = texture(uNoiseTextureSampler, oTexCoord);
    if (noise.a < uLowThreshold || noise.a > uHighThreshold)
    {
        discard;
    }

    //FragColor = texture(uTextureSampler, oTexCoord);
    FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
