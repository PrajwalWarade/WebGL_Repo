#version 300 es

precision mediump float;

in vec4 aPosition;

uniform mat4 uMVPMatrix;

void main(void) {
    gl_PointSize = 10.0;
    gl_Position = uMVPMatrix * aPosition;
}
