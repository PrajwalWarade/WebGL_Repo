#version 300 es
precision highp float;

in vec4 aPosition;
in vec3 aNormal;
in vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 uColor;
uniform vec3 uLightPos;
uniform vec3 uViewPos;

out vec3 vNormal;
out vec3 vFragPos;
out vec4 vColor;
out vec3 vViewPos;
out vec3 vLightPos;

void main(void)
{
    vec4 worldPos = uModelMatrix * aPosition;
    vFragPos = worldPos.xyz;
    vNormal = mat3(uModelMatrix) * aNormal;
    vColor = uColor;
    vViewPos = uViewPos;
    vLightPos = uLightPos;
    
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}
