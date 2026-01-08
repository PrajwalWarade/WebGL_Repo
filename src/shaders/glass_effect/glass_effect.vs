#version 300 es
in vec4 aPosition;
in vec3 aNormal;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform vec3 uLightPos;
out vec3 vNormal;
out vec3 vEyeDir;
out vec4 vEyePos;
out float vLightIntensity;
void main(void) {
    vec4 pos = uModelViewMatrix * aPosition;
    vNormal = normalize(uNormalMatrix * aNormal);
    vEyeDir = pos.xyz;
    vEyePos = uProjectionMatrix * pos;
    vLightIntensity = max(dot(normalize(uLightPos - vEyeDir), vNormal), 0.0f);
    gl_Position = vEyePos;
}
