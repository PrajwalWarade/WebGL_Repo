#version 300 es
precision highp float;

uniform vec3 u_color;

out vec4 FragColor;

void main(void) {

    FragColor = vec4(u_color, 1.0f);
}
