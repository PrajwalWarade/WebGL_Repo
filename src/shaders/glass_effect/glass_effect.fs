#version 300 es
precision highp float;
const vec3 Xunitvec = vec3(1.0f, 0.0f, 0.0f);
const vec3 Yunitvec = vec3(0.0f, 1.0f, 0.0f);
uniform vec3 BaseColor;
uniform float Depth;
uniform float MixRatio;
uniform float FrameWidth;
uniform float FrameHeight;
uniform sampler2D EnvMap;
uniform sampler2D RefractionMap;
in vec3 vNormal;
in vec3 vEyeDir;
in vec4 vEyePos;
in float vLightIntensity;
out vec4 FragColor;
void main() {
    // Compute reflection vector\n" +
    vec3 reflectDir = reflect(vEyeDir, normalize(vNormal));
    // Compute altitude and azimuth angles\n" +
    vec2 index;
    index.y = dot(normalize(reflectDir), Yunitvec);
    reflectDir.y = 0.0f;
    index.x = dot(normalize(reflectDir), Xunitvec) * 0.5f;
    // Translate index values into proper range\n" +
    if(reflectDir.z >= 0.0f)
        index = (index + 1.0f) * 0.5f;
    else {
        index.t = (index.t + 1.0f) * 0.5f;
        index.s = (-index.s) * 0.5f + 1.0f;
    }
    // Lookup environment map color
    vec3 envColor = texture(EnvMap, index).rgb;
    // Calculate fresnel term
    float fresnel = abs(dot(normalize(vEyeDir), normalize(vNormal)));
    fresnel *= MixRatio;
    fresnel = clamp(fresnel, 0.1f, 0.9f);
    // Calculate refraction
    vec3 refractionDir = normalize(vEyeDir) - normalize(vNormal);
    float depthVal = Depth / -refractionDir.z;
    // Perform the division by w
    float recipW = 1.0f / vEyePos.w;
    vec2 eye = vEyePos.xy * vec2(recipW);
    // Calculate the refraction lookup
    index.s = (eye.x + refractionDir.x * depthVal);
    index.t = (eye.y + refractionDir.y * depthVal);
    // Scale and shift so we're in the range 0-1
    index.s = index.s / 2.0f + 0.5f;
    index.t = index.t / 2.0f + 0.5f;
    // Clamp to avoid sampling outside the texture boundaries
    float recip1k = 1.0f / 2048.0f;
    index.s = clamp(index.s, 0.0f, 1.0f - recip1k);
    index.t = clamp(index.t, 0.0f, 1.0f - recip1k);
    // Scale the texture coordinates to fit the framebuffer\n" +
    index.s = index.s * FrameWidth * recip1k;
    index.t = index.t * FrameHeight * recip1k;
    // Lookup refraction color\n" +
    vec3 RefractionColor = texture(RefractionMap, index).rgb;
    // Add lighting to base color and mix\n" +
    vec3 base = vLightIntensity * BaseColor.rgb;
    envColor = mix(envColor, RefractionColor, fresnel);
    envColor = mix(envColor, base, 0.2f);
    FragColor = vec4(envColor, 1.0f);
    FragColor = vec4(envColor, 1.0f);
}
