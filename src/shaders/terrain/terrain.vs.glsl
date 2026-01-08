#version 300 es

in vec3 a_position;
in vec2 texCoord;
in vec3 normal;
in vec3 tangent;
in vec3 binormal;
in vec3 color;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

uniform vec4 u_plane;
uniform vec3 uCameraviewPos;
// uniform int bEnbaleExpFog;

out vec3 position_out;
out vec2 texCoord_out;
out vec3 normal_out;
out vec3 tangent_out;
out vec3 binormal_out;
out vec3 color_out;
out vec3 worldPos;
out float v_fogDepth;

// out float gl_ClipDistance[1];

void main() {

    texCoord_out = texCoord;
    normal_out = normalize(normal);
    color_out = color;

    tangent_out = tangent * mat3(uModelMatrix);
    tangent_out = normalize(tangent_out);

    binormal_out = binormal * mat3(uModelMatrix);
    binormal_out = normalize(binormal_out);
    //position_out = vec3(uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(a_position, 1.0f));
    position_out = vec3(uModelMatrix * vec4(a_position, 1.0f));
    worldPos = a_position;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(a_position, 1.0f);
    // vec4 plane = vec4(0.0f, 1.0f, 0.0f, 0.0f);
    // if(bEnbaleExpFog == 1) 
    // {
    //     vec4 worldPosition = uViewMatrix * uModelMatrix * vec4(a_position, 1.0f);
    //     v_fogDepth = distance((worldPosition).xyz, uCameraviewPos);
    // }
      // gl_ClipDistance[0] = dot(uModelMatrix * vec4(a_position, 0.0f), plane);
}
