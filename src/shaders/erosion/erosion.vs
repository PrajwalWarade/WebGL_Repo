#version 300 es

precision highp float;

in vec4 aPosition;
in vec3 aTexCoord;
out vec3 oTexCoord;
uniform mat4 uMVPMatrix;

void main(void)
{
    gl_Position = uMVPMatrix * aPosition;
    oTexCoord = aTexCoord;
}
