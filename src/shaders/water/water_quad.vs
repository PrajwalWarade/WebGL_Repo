#version 300 es
// precision mediump int;
// in vec4 a_position;
layout (location = 0) in vec3 a_position;                                           
layout (location = 1) in vec3 aNor;   
layout (location = 2) in vec2 aTex;

out vec4 clipSpaceCoords;
out vec2 a_texcoords_out;
out vec3 toCameraVector;

out vec3 mainLightDirection;

out vec3 a_position_out;
out vec3 outWorldPos;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

uniform vec3 u_cameraPosition;

uniform vec3 u_lightPosition;

const float pi = 3.14159f;
uniform float time;

uniform bool enable[8];
uniform float amplitude[8];
uniform float wavelength[8];
uniform float direction[8];
uniform float speed[8];

uniform float tiling;

float wave(int i) {
    float frequency = 2.0f * pi / wavelength[i];
    float phase = speed[i] * frequency;
    float d = direction[i] * pi / 180.0f;
    vec2 dir = vec2(cos(d), sin(d));
    float theta = dot(dir, vec2(a_position.x, a_position.y));
    return amplitude[i] * sin(theta * frequency + time * phase);
}

float bigWaveHeight() {
    float height = 0.0f;
    for(int i = 0; i < 4; i++) {
        if(enable[i])
            height += wave(i);
    }
    return height;
}

void main(void) {

   // float height = bigWaveHeight(); For Vertex Displacement

    vec4 worldPosition = u_modelMatrix * vec4(a_position.x, 0.0f, a_position.y, 1.0f);
    clipSpaceCoords = u_projectionMatrix * u_viewMatrix * worldPosition;
    a_texcoords_out = vec2(a_position.x / 2.0f + 0.5f, a_position.y / 2.0f + 0.5f) * tiling;
    // a_texcoords_out = aTex;
    toCameraVector = u_cameraPosition - worldPosition.xyz;
    mainLightDirection = worldPosition.xyz - u_lightPosition;
    outWorldPos = vec3(worldPosition);
    gl_Position = clipSpaceCoords;
    a_position_out = vec3(gl_Position);
}
