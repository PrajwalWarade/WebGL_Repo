#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform vec4 u_lightPosition[3];
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform highp int u_lightingEnabled;

out vec3 transformedNormals;
out vec3 lightDirection[3];
out vec3 viewerVector;

void main(void) {
    if(u_lightingEnabled == 1) {
        vec4 eyeCoordinates = u_viewMatrix * u_modelMatrix * a_position;
        mat3 normalMatrix = mat3(u_viewMatrix * u_modelMatrix);
        transformedNormals = normalize(normalMatrix * a_normal);
        viewerVector = normalize(-eyeCoordinates.xyz);
        for(int i = 0; i < 3; i++) {
            lightDirection[i] = normalize(vec3(u_lightPosition[i]) - eyeCoordinates.xyz);
        }
    }
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
}
