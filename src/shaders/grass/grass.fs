#version 300 es
precision highp float;

in vec2 vUv;
in vec3 vNormal;
in vec3 vPosition;
in float vBladeId;

uniform vec3 uLightDir;
uniform vec3 uGrassColorBase;
uniform vec3 uGrassColorTip;

out vec4 FragColor;

void main() {
    vec3 grassColor = mix(uGrassColorBase, uGrassColorTip, vUv.y);
    
    float variation = fract(sin(vBladeId * 43758.5453123)) * 0.1 - 0.05;
    grassColor += variation;
    
    // Lighting
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightDir);
    
    // Diffuse lighting
    float diffuse = max(dot(normal, lightDir), 0.0);
    
    // Ambient occlusion
    float ao = mix(0.5, 1.0, vUv.y);
    
    // Subsurface scattering effect
    float backLight = max(0.0, dot(normal, -lightDir)) * 0.4;
    
    // Combine lighting
    float ambient = 0.3;
    float lighting = ambient + (diffuse * 0.7 + backLight) * ao;
    
    vec3 color = grassColor * lighting;
    
    vec3 viewDir = normalize(vec3(0.0, 1.0, 2.0));
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    color += fresnel * 0.1;
    
    float alpha = 1.0;
    if (vUv.x < 0.05 || vUv.x > 0.95) {
        alpha = smoothstep(0.0, 0.05, min(vUv.x, 1.0 - vUv.x));
    }
    
    FragColor = vec4(color, alpha);
}
