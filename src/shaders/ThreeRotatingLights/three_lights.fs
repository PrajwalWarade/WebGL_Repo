#version 300 es

precision highp float;

in vec3 transformedNormals;
in vec3 lightDirection[3];
in vec3 viewerVector;

uniform highp vec3 u_la[3];
uniform vec3 u_ld[3];
uniform vec3 u_ls[3];
uniform vec4 u_lightPosition[3];
uniform vec3 u_ka;
uniform vec3 u_ks;
uniform vec3 u_kd;
uniform float u_materialShininnes;
uniform highp int u_lightingEnabled;

out vec4 FragColor;

vec3 phong_ads_light;

void main(void) {
    phong_ads_light = vec3(0.0f, 0.0f, 0.0f);
    if(u_lightingEnabled == 1) {
        vec3 ambiant[3];
        vec3 diffuse[3];
        vec3 reflectionVector[3];
        vec3 specular[3];
        for(int i = 0; i < 3; i++) {
            ambiant[i] = u_la[i] * u_ka;
            diffuse[i] = u_ld[i] * u_kd * max(dot(lightDirection[i], transformedNormals), 0.0f);
            reflectionVector[i] = reflect(-lightDirection[i], transformedNormals);
            specular[i] = u_ls[i] * u_ks * pow(max(dot(reflectionVector[i], viewerVector), 0.0f), u_materialShininnes);

            phong_ads_light = phong_ads_light + ambiant[i] + diffuse[i] + specular[i];
        }
    } else {
        phong_ads_light = vec3(1.0f, 1.0f, 1.0f);
    }
    FragColor = vec4(phong_ads_light, 1.0f);
}
