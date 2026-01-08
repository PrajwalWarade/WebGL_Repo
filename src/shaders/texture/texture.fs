#version 300 es

precision highp float;
in vec2 oTexCoord;
uniform sampler2D uTextureSampler;
uniform float opacity;
uniform int bDisbaleOpacity;
out vec4 FragColor;
void main(void) {
    if(texture(uTextureSampler, oTexCoord).a < 0.1f)
        discard;
    if(bDisbaleOpacity == 1)
        FragColor = texture(uTextureSampler, oTexCoord);
    else
        FragColor = texture(uTextureSampler, oTexCoord) * opacity;
}
