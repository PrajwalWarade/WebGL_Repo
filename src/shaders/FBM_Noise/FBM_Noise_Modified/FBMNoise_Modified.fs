#version 300 es

precision highp float;
out vec4 FragColor;
in vec2 oTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898f, 78.233f))) * 43758.5453123f);
}

float noise(in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    float a = random(i);
    float b = random(i + vec2(1.0f, 0.0f));
    float c = random(i + vec2(0.0f, 1.0f));
    float d = random(i + vec2(1.0f, 1.0f));
    vec2 u = f * f * (3.0f - 2.0f * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0f - u.x) + (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm(in vec2 _st) {
    float value = 0.0f;
    float amplitude = 0.5f;
    vec2 shift = vec2(100.0f);
    mat2 rotation = mat2(cos(0.5f), sin(0.5f), -sin(0.5f), cos(0.5f));
    for(int i = 0; i < NUM_OCTAVES; ++i) {
        value += amplitude * noise(_st);
        _st = rotation * _st * 2.0f + shift;
        amplitude *= 0.5f;
    }
    return value;
}

void main(void) {
    vec2 st = oTexCoord * u_resolution.xy / u_resolution.y * 3.0f;
    vec3 color = vec3(0.0f, 0.0f, 0.0f);
    vec2 q = vec2(0.0f);
    q.x = fbm(st + 0.00f * u_time);
    q.y = fbm(st + vec2(1.0f));
    vec2 r = vec2(0.0f);
    r.x = fbm(st + 1.0f * q + vec2(1.7f, 9.2f) + 0.15f * u_time);
    r.y = fbm(st + 1.0f * q + vec2(8.3f, 2.8f) + 0.126f * u_time);
    float f = fbm(st + r);

    float dist = distance(oTexCoord, vec2(0.0f)); // Calculate distance from center
    float vignette = smoothstep(0.3f, 0.7f, dist); // first parameter is radious 

    color = mix(color1, color2, clamp((f * f) * 0.3f, 0.0f, 1.0f)); // manipulate first parameter for fog density(ex. 0.3 to 0.2)
    color = mix(color, color3, clamp(length(q) * 0.3f, 0.0f, 1.0f));// manipulate first parameter for fog density(ex. 0.3 to 0.2)
    color = mix(color, color4, clamp(length(r.x) * 0.3f, 0.0f, 1.0f));// manipulate first parameter for fog density(ex. 0.3 to 0.2)

    FragColor = vec4((f * f * f + 0.6f * f * f + 0.5f * f) * color * vignette * 0.3f, 1.0f); // manipulate first parameter for fog density(ex. 0.3 to 0.2)
    // FragColor  =  vec4(1.0);
}
