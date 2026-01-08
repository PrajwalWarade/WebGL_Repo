#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vFragPos;
in vec4 vColor;
in vec3 vViewPos;
in vec3 vLightPos;

out vec4 FragColor;

void main(void)
{
    // ONLY EMISSION - no angle dependency
    vec3 emission = vColor.rgb * 0.95;
    
    // doesn't work with triangle geometry
    // float edgeFade = 1.0 - length(gl_PointCoord - 0.5) * 2.0;
    // edgeFade = clamp(edgeFade, 0.0, 1.0);
    
    // for sphere particles
    vec3 result = emission;
    
    FragColor = vec4(result, vColor.a);
}
