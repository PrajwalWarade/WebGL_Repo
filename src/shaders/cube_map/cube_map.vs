#version 300 es

precision mediump float;

in vec4 aPosition;

uniform mat4 uMVPMatrix;
uniform mat4 modelMatrix;

out vec3 v_normal;
out vec4 v_position;
out vec3 worldPosition;

void main(void) {
    worldPosition = vec3(modelMatrix * aPosition);

    v_position = (aPosition);
    gl_Position = uMVPMatrix * aPosition;
    v_normal = normalize(aPosition.xyz);
}