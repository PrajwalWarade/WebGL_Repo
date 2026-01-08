#version 300 es
precision mediump float;

in vec2 v_texcoord;

uniform sampler2D tex;
uniform float threshold;

out vec4 fragColor;

void main() {
    vec4 color = texture(tex, v_texcoord);
    float brightness = dot(color.rgb, vec3(0.2126f, 0.7152f, 0.0722f));
    fragColor = mix(vec4(0, 0, 0, 1), color, step(threshold, brightness));
}
