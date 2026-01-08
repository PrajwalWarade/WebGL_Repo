#version 300 es

in vec3 vPosition;
in vec3 vNormal;
in vec2 vTexCoord;
in vec4 vTangent;
in vec4 biTangent;
in ivec4 vJoints;
in vec4 vWeights;

layout(location=7) in mat4 aModelMatrix;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uJointTransform[100];

uniform vec3 u_viewWorldPosition;

uniform int uIsAnimated;
uniform int bInstanced;
// uniform vec3 uCameraPosition;

out vec3 v_normal;
out vec3 v_tangent;
// out vec3 v_surfaceToView;
out vec2 v_texcoord;
out vec3 v_frag_pos;
out vec3 v_bitangent;

// for dissolve effect
out vec3 out_vPosition;

void main() {
    mat4 modelMatrix;
    if(bInstanced == 1)
    {
        modelMatrix = aModelMatrix;
    }
    else
    {
        modelMatrix = uModelMatrix;
    }

    mat4 skinMatrix = mat4(1.0f);
    if(uIsAnimated == 1) {
        skinMatrix = vWeights.x * uJointTransform[int(vJoints.x)] +
            vWeights.y * uJointTransform[int(vJoints.y)] +
            vWeights.z * uJointTransform[int(vJoints.z)] +
            vWeights.w * uJointTransform[int(vJoints.w)];
    }

    mat4 normalMatrix = skinMatrix;

    v_tangent = normalize(mat3(normalMatrix) * vec3(vTangent));
    v_bitangent = normalize(mat3(normalMatrix) * vec3(biTangent));
    v_normal = normalize(mat3(normalMatrix) * vec3(skinMatrix * vec4(vNormal, 1.0f)));
    v_texcoord = vTexCoord;

    v_frag_pos = vec3(modelMatrix * skinMatrix * vec4(vPosition, 1.0f));

    mat3 normalMat = mat3(modelMatrix);
    v_normal = normalize(mat3(normalMat) * vec3(skinMatrix * vec4(vNormal, 1.0f)));
    v_tangent = normalize(normalMat * vec3(vTangent));
    v_bitangent = normalize(mat3(normalMat) * vec3(biTangent));

    out_vPosition = vPosition;  // for dissolve effect

    // v_surfaceToView = uCameraPosition - v_frag_pos.xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * modelMatrix * skinMatrix * vec4(vPosition, 1.0f);
}
