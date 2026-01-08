#version 300 es

precision highp float;

in vec3 position_out;
in vec2 texCoord_out;
in vec3 normal_out;
in vec3 tangent_out;
in vec3 binormal_out;
in vec3 color_out;
in vec3 worldPos;
in float v_fogDepth;

uniform vec3 diffuseColor;
uniform vec3 lightDirection;
uniform float padding;
uniform float uAlpha;

uniform sampler2D shaderTexture;
uniform sampler2D normalTexture;

uniform int enbaleClipping;
uniform int upSide;

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
uniform vec3 uCameraviewPos;

out vec4 Frag_Color;

uniform int bEnbaleFog;
uniform float fogFalloff;
uniform vec3 fogColor;
uniform float gDispFactor;

const float c = 18.f;
const float b = 3.e-6f;

uniform int bEnbaleExpFog;
uniform vec4 uFogColorExp;
uniform float uFogDensityExp;
uniform float uFogNearExp;
uniform float uFogFarExp;

uniform int bGodRaysPass;

float applyFog(
    in vec3 rgb,      // original color of the pixel
    in float dist, // camera to point distance
    in vec3 cameraPos,   // camera position
    in vec3 rayDir
)  // camera to point vector
{
    float dist2 = dist * 0.1f;
    float fogAmount = c * exp(-cameraPos.y * fogFalloff) * (1.0f - exp(-dist2 * rayDir.y * fogFalloff)) / rayDir.y;
    vec3 fogColor = vec3(0.5f, 0.6f, 0.7f);
    //return clamp(fogAmount, 0.0f, 1.0f);//mix( rgb, fogColor, fogAmount );
    return fogAmount;//mix( rgb, fogColor, fogAmount );
}

vec3 calculatePointLights(vec3 diffuse, vec3 specular, vec3 bump_normal) {
// then calculate lighting as usual
    vec3 lighting = diffuse * 0.1f; // hard-coded ambient component
    vec3 viewDir = normalize(uCameraviewPos - position_out);
    for(int i = 0; i < NR_LIGHTS; ++i) {
        // calculate distance between light source and current fragment
        float distance = length(lights[i].Position - position_out);
        if(distance < lights[i].Radius) {
            // diffuse
            vec3 lightDir = normalize(lights[i].Position - position_out);
            vec3 diffuse = max(dot(bump_normal, lightDir), 0.0f) * diffuse * lights[i].Color;
            // specular
            vec3 halfwayDir = normalize(lightDir + viewDir);
            float spec = pow(max(dot(bump_normal, halfwayDir), 0.0f), 16.0f);
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

void main() {

    if(enbaleClipping == 1) {
        if(position_out.y <= 0.0f && upSide == 1) {
            discard;
        } else if(position_out.y >= 1.0f && upSide == 0) {
            discard;
        }
    }

    if(bGodRaysPass == 1) {
        Frag_Color = vec4(0.0f);
    } else {
        vec4 textureColor;
        vec3 lightDir;
        vec4 bumpMap;
        vec3 bumpNormal;
        float lightIntensity;
        vec4 color;

    // Sample the pixel color from the texture using the sampler at this texture coordinate location.
    //    textureColor = texture(shaderTexture, texCoord_out);

    // Mix the textureColor and input color 
    //    textureColor = textureColor * vec4(color_out, 1.0f) * 2.2f;

    // Invert the light direction for calculations.
        lightDir = -lightDirection;

    // Calculate the amount of light on this pixel using the normal map.
        bumpMap = texture(normalTexture, texCoord_out);
        bumpMap = (bumpMap * 2.0f) - 1.0f;
        bumpNormal = (bumpMap.x * tangent_out) + (bumpMap.y * binormal_out) + (bumpMap.z * normal_out);
        bumpNormal = normalize(bumpNormal);

        lightIntensity = max(dot(bumpNormal, lightDir), 0.0f);
        // lightIntensity = clamp(dot(normal_out, lightDir), 0.0f, 1.0f);


    // Determine the final amount of diffuse color based on the diffuse color combined with the light intensity.
        color = clamp(vec4(diffuseColor - lightIntensity * (diffuseColor), 1.0f), 0.0f, 1.0f);

    // Multiply the texture pixel and the final diffuse color to get the final pixel color result.
        color = (color + 0.5f) * vec4(color_out, 1.0f);

    // Frag_Color 

        float fogFactor = applyFog(vec3(0.0f), distance(vec3(uCameraviewPos[0], 1.938201904296875f, uCameraviewPos[2]), position_out), vec3(uCameraviewPos[0], 1.938201904296875f, uCameraviewPos[2]), normalize(worldPos - vec3(uCameraviewPos[0], 1.938201904296875f, uCameraviewPos[2])));
    // float fogFactor = applyFog(vec3(0.0f), distance(vec3(uCameraviewPos[0],1.938201904296875,uCameraviewPos[2]), position_out), vec3(396.1396179199219,1.938201904296875,-355.13623046875), normalize(worldPos - vec3(396.1396179199219,1.938201904296875,-355.13623046875)));
    // float fogFactor = applyFog(vec3(0.0f), distance(vec3(396.1396179199219,1.938201904296875,-355.13623046875), position_out), vec3(396.1396179199219,1.938201904296875,-355.13623046875), normalize(worldPos - vec3(396.1396179199219,1.938201904296875,-355.13623046875)));
    // float fogFactor = applyFog(vec3(0.0f), distance(uCameraviewPos, worldPos), uCameraviewPos, normalize(worldPos - uCameraviewPos));
        float eps = 0.1f;

        if(bNightScene == 0)
            color = color;
        else
            color = vec4(calculatePointLights(vec3(color), vec3(0.1f), bumpNormal), 1.0f);

        if(bEnbaleFog == 1) {
        // Frag_Color = mix(color, vec4(fogColor, 1.0), fogFactor);
            Frag_Color = mix(color, vec4(mix(fogColor * 1.1f, fogColor * 0.85f, clamp(position_out.y / 0.1f, 0.0f, 0.3f)), 1.0f), fogFactor);
            Frag_Color.a = position_out.y / 0.0f;

        //Frag_Color = mix(color, vec4(mix(fogColor * 1.1f, fogColor * 0.85f, smoothFactor), 1.0f), fogFactor);
        } else if(bEnbaleExpFog == 1) {
            float fogFactor = clamp((v_fogDepth - uFogNearExp) / (uFogFarExp - uFogNearExp), 0.0f, 1.0f);
            float fogAmount = fogFactor * (1.0f - exp(-uFogDensityExp * v_fogDepth));

            Frag_Color = mix(color, uFogColorExp, fogAmount);
        } else {
            Frag_Color = color * uAlpha;
        }
    }
}
