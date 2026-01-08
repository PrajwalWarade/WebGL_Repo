#version 300 es
precision highp float;

layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec2 a_Texcoord;
layout(location = 2) in vec3 a_Normal;
layout(location = 3) in float a_BladeId;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform float uTime;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;
out float vBladeId;

void main() {
    vec3 pos = a_Position;
    
    // Wind animation
    float windStrength = 0.2;
    float windSpeed = 0.8;
    
    float wind1 = sin(uTime * windSpeed + pos.x * 2.0 + pos.z * 2.0) * windStrength;
    float wind2 = cos(uTime * windSpeed * 1.3 - pos.x * 1.5 + pos.z * 1.5) * windStrength * 0.5;
    
    float heightFactor = smoothstep(0.0, 1.0, a_Position.y / 1.5);
    pos.x += (wind1 + wind2) * heightFactor;
    pos.z += wind1 * 0.3 * heightFactor;
    
    float sway = sin(uTime * windSpeed + a_BladeId * 10.0) * 0.05 * heightFactor;
    pos.x += sway;
    
    vec4 worldPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * worldPos;
    
    vUv = a_Texcoord;
    vNormal = mat3(normalMatrix) * a_Normal;
    vPosition = pos;
    vBladeId = a_BladeId;
}
