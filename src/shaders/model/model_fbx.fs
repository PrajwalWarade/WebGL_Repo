#version 300 es

precision highp float;

#define LIGHT_INTENSITY 1.0
#define LIGHT_DIRECTION vec3(-0.7, -0.7, 1.0)
#define LIGHT_COLOR vec3(1.0)
#define M_PI 3.141592653589793

in vec3 v_normal;
in vec3 v_tangent;
in vec2 v_texcoord;
in vec3 v_frag_pos;
in vec3 v_bitangent;

uniform sampler2D uBaseColorTexture;
uniform int uHasBaseColorTexture;
uniform vec4 uBaseColorFactor;

uniform sampler2D uMetallicRoughnessTexture;
uniform int uHasMetallicRoughnessTexture;
uniform float uMetallicFactor;
uniform float uRoughnessFactor;

uniform sampler2D uEmissiveTexture;
uniform int uHasEmissiveTexture;
uniform vec3 uEmissiveFactor;

uniform sampler2D uNormalTexture;
uniform int uHasNormalTexture;

uniform sampler2D uOcclusionTexture;
uniform int uHasOcclusionTexture;

uniform sampler2D uBrdfLut;
uniform sampler2D uEnvironmentDiffuse;
uniform sampler2D uEnvironmentSpecular;

uniform vec3 uCameraPosition;
uniform vec3 uCameraviewPos;

uniform vec3 uDirectionalLightDirection;
uniform vec3 uDirectionalLightColor;
uniform float uDirectionalLightIntensity;
uniform float uAmbaintFactor;

uniform int enbaleClipping;
uniform int upSide;
uniform float uAlpha;

// POINT LIGHTS
struct Light {
    vec3 Position;
    vec3 Color;

    float Linear;
    float Quadratic;
    float Radius;
};

const int NR_LIGHTS = 64;
uniform Light lights[NR_LIGHTS];
uniform int bNightScene;

// GOD RAYS
uniform int bEnabelGodRaysPass;

//==============================================
// DISSOLVE EFFECT REQUIRED UNIFORMS
uniform int bEnableDissolvePass;
uniform float uProgress;
uniform float uEdge;
uniform vec3 uEdgeColor;
uniform float uFrequency;
uniform float uAmplitude;
in vec3 out_vPosition;
//==============================================

out vec4 FragColor;

vec3 calculatePointLights(vec3 diffuse, vec3 specular) {
// then calculate lighting as usual
    vec3 lighting = diffuse * 0.1f; // hard-coded ambient component
    vec3 viewDir = normalize(uCameraviewPos - v_frag_pos);
    for(int i = 0; i < NR_LIGHTS; ++i) {
        // calculate distance between light source and current fragment
        float distance = length(lights[i].Position - v_frag_pos);
        if(distance < lights[i].Radius) {
            // diffuse
            vec3 lightDir = normalize(lights[i].Position - v_frag_pos);
            vec3 diffuse = max(dot(v_normal, lightDir), 0.0f) * diffuse * lights[i].Color;
            // specular
            vec3 halfwayDir = normalize(lightDir + viewDir);
            float spec = pow(max(dot(v_normal, halfwayDir), 0.0f), 16.0f);
            vec3 specular = lights[i].Color * spec * specular;
            // attenuation
            float attenuation = 1.0f / (1.0f + lights[i].Linear * distance + lights[i].Quadratic * distance * distance);
            diffuse *= attenuation;
            specular *= attenuation;
            lighting += diffuse + specular;
        }
    }
    return lighting;
}

vec3 getNormal() {
    if(uHasNormalTexture == 1) {
        vec3 normal = texture(uNormalTexture, v_texcoord).rgb * 2.0f - 1.0f;
        mat3 tbn = mat3(normalize(v_tangent), normalize(v_bitangent), normalize(v_normal));
        return normalize(tbn * normal);
    } else {
        return normalize(v_normal);
    }
}

// SIMPLE NOISE FUNCTION    ====================================================
float hash(float n) {
    return fract(sin(n) * 1e4f);
}
float hash(vec2 p) {
    return fract(1e4f * sin(17.0f * p.x + p.y * 0.1f) * (0.1f + abs(sin(p.y * 13.0f + p.x))));
}

float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0f - 2.0f * f);

    float n = p.x + p.y * 157.0f + 113.0f * p.z;
    return mix(mix(mix(hash(n + 0.0f), hash(n + 1.0f), f.x), mix(hash(n + 157.0f), hash(n + 158.0f), f.x), f.y), mix(mix(hash(n + 113.0f), hash(n + 114.0f), f.x), mix(hash(n + 270.0f), hash(n + 271.0f), f.x), f.y), f.z);
}
//==============================================================================

void main() {
    if(enbaleClipping == 1) {
        if(v_frag_pos.y <= 0.0f && upSide == 1) {
            discard;
        } else if(v_frag_pos.y >= 0.0f && upSide == 0) {
            discard;
        }
    }

    /*vec3 normal = getNormal();

    vec4 baseColor = uHasBaseColorTexture == 1 ? texture(uBaseColorTexture, v_texcoord) * uBaseColorFactor : uBaseColorFactor;
    float metallic = uHasMetallicRoughnessTexture == 1 ? texture(uMetallicRoughnessTexture, v_texcoord).b * uMetallicFactor : uMetallicFactor;
    float roughness = uHasMetallicRoughnessTexture == 1 ? texture(uMetallicRoughnessTexture, v_texcoord).g * uRoughnessFactor : uRoughnessFactor;

    vec3 emissive = uHasEmissiveTexture == 1 ? texture(uEmissiveTexture, v_texcoord).rgb * uEmissiveFactor : vec3(0.5);

    vec3 viewDir = normalize(uCameraviewPos - v_frag_pos);
    
    // Point Light Calculation
    vec3 lightDir = normalize(LIGHT_DIRECTION);

    vec3 F0 = vec3(0.04);
    F0 = mix(F0, baseColor.rgb, metallic);

    vec3 L = normalize(-LIGHT_DIRECTION);
    vec3 N = normalize(normal);
    vec3 H = normalize(viewDir + L);
    float NDF = max(dot(N, H), 0.0);
    float k = (roughness + 1.0) * (roughness + 1.0) / 8.0;
    float ggx1 = NDF * k;
    float ggx2 = NDF * k + (1.0 - k);
    float G = ggx1 / ggx2;

    float kS = pow(1.0 - max(dot(N, viewDir), 0.0), 5.0);
    vec3 kD = vec3(1.0 - kS);

    vec3 numerator = G * F0;
    vec3 denominator = vec3(4.0 * max(dot(N, viewDir), 0.0) * max(dot(N, L), 0.0) + 0.0001);
    vec3 specular = numerator / denominator;

    vec3 lightRadiance = LIGHT_COLOR * LIGHT_INTENSITY * max(dot(N, L), 0.0);
    vec3 ambientColor = vec3(uAmbaintFactor) * baseColor.rgb;
    vec3 diffuse = (1.0 - metallic) * baseColor.rgb / M_PI;
    vec3 pointLight = (kD * diffuse + specular) * lightRadiance;

    // Directional Light Calculation
    vec3 dirLightDir = normalize(uDirectionalLightDirection);
    vec3 L2 = normalize(dirLightDir);
    vec3 H2 = normalize(viewDir + L2);
    float NDF2 = max(dot(N, H2), 0.0);
    float G2 = NDF2 * k / (NDF2 * k + (1.0 - k));
    vec3 numerator2 = G2 * F0;
    vec3 denominator2 = vec3(4.0 * max(dot(N, viewDir), 0.0) * max(dot(N, L2), 0.0) + 0.0001);
    vec3 specular2 = numerator2 / denominator2;

    vec3 dirLightRadiance = uDirectionalLightColor * uDirectionalLightIntensity * max(dot(N, L2), 0.0);
    vec3 directionalLight = (kD * diffuse + specular2) * dirLightRadiance;

    vec3 lighting =  pointLight + directionalLight + ambientColor + emissive;

    FragColor = vec4(lighting, baseColor.a);
    FragColor = vec4(ambientColor, 1.0);*/

    // // obtain normal from normal map in range [0,1]
    // vec3 normal = texture(uNormalTexture, v_texcoord).rgb;
    // // transform normal vector to range [-1,1]
    // normal = normalize(normal * 2.0f - 1.0f);  // this normal is in tangent space

    if(bEnabelGodRaysPass == 1) {
        FragColor = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    } else {

        vec3 normal = getNormal();

    // get diffuse color
        if(texture(uBaseColorTexture, v_texcoord).a < 0.1f)
            discard;

        vec3 color;
        if(uHasBaseColorTexture == 1)
            color = texture(uBaseColorTexture, v_texcoord).rgb * vec3(uBaseColorFactor);
        else
            color = vec3(uBaseColorFactor);

    // ambient
        vec3 ambient = uAmbaintFactor * color;
    // diffuse
        vec3 lightDir = normalize(v_tangent - v_frag_pos);
        float diff = max(dot(lightDir, normal), 0.0f);
        vec3 diffuse = diff * color;
    // specular
        vec3 viewDir = normalize(v_tangent - v_frag_pos);
        vec3 reflectDir = reflect(-lightDir, normal);
        vec3 halfwayDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfwayDir), 0.0f), 32.0f);

        vec3 specular = vec3(0.2f) * spec;
        if(bNightScene == 0)
            FragColor = vec4(ambient + diffuse + specular, texture(uBaseColorTexture, v_texcoord).a) * uAlpha;
        else
            FragColor = vec4(calculatePointLights(ambient, vec3(0.1f, 0.1f, 0.1f)), 1.0f) * uAlpha;
    }

    // DISSOLVE EFFECT IMPLEMENTATION ============================================
    if(bEnableDissolvePass == 1) {
        vec3 pos = out_vPosition * uFrequency;
        float noiseValue = noise(pos) * uAmplitude; // Calculate noise based on position

        // Normalize noise value to [0, 1]
        noiseValue = (noiseValue + 1.0f) / 2.0f;

        if(noiseValue < uProgress) {
            discard; // Discard fragment if below the dissolve threshold
        }

        float edgeWidth = uProgress + uEdge;

        if(noiseValue > uProgress && noiseValue < edgeWidth) {
            // Calculate edge factor
            float edgeFactor = (noiseValue - uProgress) / uEdge;
            // Mix original color with edge color based on edge factor
            vec3 finalColor = mix(FragColor.rgb, FragColor.rgb, edgeFactor);
            FragColor = vec4(finalColor, FragColor.a);
        }
    }
    // ===========================================================================

}
