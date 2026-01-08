#version 300 es

precision highp float;

in vec2 aPosition;
in vec4 aColor;
in vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

out vec4 oColor;
out vec2 oTexCoord;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 0.0, 1.0);
    oColor = aColor;
    oTexCoord = aTexCoord;
}
